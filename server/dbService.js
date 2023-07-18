// Importing packages and requiring them into variables
const mysql = require("mysql");
const dotenv = require("dotenv");
dotenv.config();
let instance = null;

// Creating Database Connection
const connection = mysql.createConnection({
  host: process.env.HOST,
  user: process.env.USER,
  password: process.env.PASSWORD,
  database: process.env.DATABASE,
  port: process.env.DB_PORT,
});

// Checking if connection is a success
connection.connect((err) => {
  if (err) {
    console.log(err.message);
  }
  console.log("Database " + connection.state);
});

// Creating a database instance dynamically
class DbService {
  static getDBServiceInstance() {
    return instance ? instance : new DbService();
  }

  // Fetching all data from database when page loads
  async getAllData() {
    try {
      const response = await new Promise((resolve, reject) => {
        // Get all data from database table query selector
        const query = "SELECT * FROM names;";

        // making the query to the database to get data in result parameter
        connection.query(query, (err, result) => {
          if (err) reject(new Error(err.message));
          resolve(result);
        });
      });
      // console.log(response);
      return response;
    } catch (error) {
      console.log(error);
    }
  }

  // Insert given name into database function
  async insertNewName(name) {
    try {
      const dateAdded = new Date();
      const insertId = await new Promise((resolve, reject) => {
        // insert given name into database table query selector
        const query = "INSERT INTO names (name, date_added) VALUES (?,?);";

        // making the query to insert name into table
        connection.query(query, [name, dateAdded], (err, result) => {
          // checking if there is any error
          if (err) reject(new Error(err.message));
          // if no error, then sending database row id back
          resolve(result.insertId);
        });
      });
      // console.log(insertId);
      return {
        id: insertId,
        name: name,
        dateAdded: dateAdded,
      };
    } catch (error) {
      console.log(error);
    }
  }
}

module.exports = DbService;
