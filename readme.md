# AuthCast Assignment - Backend Application

This is a backend application built using **Node.js**, **Express**, **MySQL**, and **Azure OpenAI API**. It provides an API endpoint to process plain English queries, convert them into SQL queries, execute them on a MySQL database, and return the results in plain English.

---

## Project Structure

```
AuthCastAssignment/
├── server.js          # Main server file
├── .gitignore         # Git ignore file
├── package.json       # Node.js dependencies and scripts
├── node_modules/      # Node.js modules (ignored in Git)
└── .env               # Environment variables (ignored in Git)
```

### Key Files:
1. **`server.js`**:
   - The main server file that handles API requests, interacts with the database, and communicates with the Azure OpenAI API.
   - Contains the `/ask` endpoint for processing user queries.

2. **`.gitignore`**:
   - Ensures sensitive files like `.env` and unnecessary files like `node_modules` are not tracked by Git.

3. **`.env`**:
   - Stores sensitive environment variables such as the Azure OpenAI API key and database credentials.

---

## How It Works

### 1. **Technologies Used**:
   - **Node.js**: Backend runtime environment.
   - **Express**: Web framework for building the API.
   - **MySQL**: Database for storing and querying data.
   - **Azure OpenAI API**: Used for converting plain English queries into SQL and converting SQL query results into plain English.

### 2. **Database Structure**:
   - **Schema**: `internbit`
   - **Tables**:
     - `products`: Stores product details (e.g., `id`, `name`, `price`, `category_id`).
     - `categories`: Stores category details (e.g., `id`, `name`).

   - **Relationship**:
     - `products.category_id` is a foreign key referencing `categories.id`.

### 3. **API Endpoint**:
   - **POST `/ask`**:
     - Accepts a plain English query in the request body.
     - Example Request:
       ```json
       {
         "query": "Which category has the highest priced product?"
       }
       ```
     - **Flow**:
       1. The plain English query is sent to the Azure OpenAI API to generate an SQL query.
       2. The SQL query is executed on the MySQL database.
       3. The SQL query result is sent back to the Azure OpenAI API to convert it into plain English.
       4. The final plain English result is returned to the client.
     - Example Response:
       ```json
       {
         "result": "The category with the highest priced product is Electronics."
       }
       ```

---

## How to Run the Application

### 1. **Prerequisites**:
   - Install [Node.js](https://nodejs.org/).
   - Install [MySQL](https://www.mysql.com/).
   - Set up an Azure OpenAI API account.

### 2. **Setup**:
   1. Clone the repository:
      ```bash
      git clone <repository-url>
      cd AuthCastAssignment
      ```
   2. Install dependencies:
      ```bash
      npm install
      ```
   3. Create a `.env` file in the root directory:
      ```
      GITHUB_TOKEN=<your-azure-openai-api-key>
      ```
   4. Set up the MySQL database:
      - Create a schema named `internbit`.
      - Create the `products` and `categories` tables as per the structure.

### 3. **Run the Application**:
   ```bash
   node server.js
   ```
   The server will start on `http://localhost:5000`.

---

## Example Usage

### Query 1: Find the category with the highest priced product
**Request**:
```json
{
  "query": "Which category has the highest priced product?"
}
```

**Response**:
```json
{
  "result": "The category with the highest priced product is Electronics."
}
```

---

## Notes

- Ensure the `.env` file is properly configured with your Azure OpenAI API key.
- The database schema and table names must match the structure described above.
- The `/ask` endpoint handles both SQL query generation and result interpretation seamlessly.

---

## Future Improvements

- Add authentication for the API.
- Implement caching for frequently asked queries.
- Add more robust error handling for edge cases.

---

## License

This project is licensed under the MIT License.