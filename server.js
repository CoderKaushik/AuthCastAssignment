require('dotenv').config(); // Load environment variables from .env file
const express = require('express');
const bodyParser = require('body-parser');
const mysql = require('mysql2/promise');
const { OpenAI } = require('openai'); // Correct import

const app = express();
app.use(bodyParser.json());

// Configure Azure OpenAI API
const token = process.env.GITHUB_TOKEN;
const endpoint = "https://models.inference.ai.azure.com";
const modelName = "gpt-4o-mini";

const openai = new OpenAI({
  apiKey: token,
  baseURL: endpoint, // Use the Azure OpenAI endpoint
});

// Configure MySQL connection
const db = mysql.createPool({
  host: 'localhost',
  user: 'root', // Replace with your MySQL username
  password: 'Hiteshwar@1234', // Replace with your MySQL password
  database: 'internbit', // Connect to the schema 'authcast'
});

// POST /ask endpoint
app.post('/ask', async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ error: 'Query is required' });
  }

  try {
    // Step 1: Use Azure OpenAI to generate SQL query
    const aiResponse = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Convert this plain English query into an SQL query. Only return the SQL query without any explanation or additional text: "${query}"` }
      ],
      model: modelName,
      temperature: 0.7,
      max_tokens: 100,
      top_p: 1.0
    });

    let sqlQuery = aiResponse.choices[0].message.content.trim();

    // Remove Markdown formatting (e.g., ```sql ... ```)
    sqlQuery = sqlQuery.replace(/```sql|```/g, '').trim();

    // Ensure the query references the 'internbit' schema explicitly
    sqlQuery = sqlQuery.replace(/FROM\s+(\w+)/gi, 'FROM internbit.$1');
    sqlQuery = sqlQuery.replace(/JOIN\s+(\w+)/gi, 'JOIN internbit.$1');

    // Handle cases where the query assumes a 'category' column
    if (sqlQuery.includes('category')) {
      sqlQuery = sqlQuery.replace(
        'SELECT category',
        'SELECT categories.name AS category'
      );
      sqlQuery = sqlQuery.replace(
        'FROM internbit.products',
        'FROM internbit.products JOIN internbit.categories ON products.category_id = categories.id'
      );
    }

    // Step 2: Execute the SQL query
    const [rows] = await db.query(sqlQuery);

    // Step 3: Use OpenAI to convert the result into plain English
    const resultText = JSON.stringify(rows);
    const englishResponse = await openai.chat.completions.create({
      messages: [
        { role: "system", content: "You are a helpful assistant." },
        { role: "user", content: `Convert this SQL query result into plain English: ${resultText}` }
      ],
      model: modelName,
      temperature: 0.7,
      max_tokens: 150,
      top_p: 1.0
    });

    const plainEnglishResult = englishResponse.choices[0].message.content.trim();
    res.json({ result: plainEnglishResult });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: 'An error occurred' });
  }
});

// Start the server
const PORT = 5000;
app.listen(PORT, () => {
  console.log(`Server is running on http://localhost:${PORT}`);
});