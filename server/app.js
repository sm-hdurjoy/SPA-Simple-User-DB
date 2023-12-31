// importing packages
const express = require("express");
const app = express();
const cors = require("cors");
const dotenv = require("dotenv");
dotenv.config();

const dbService = require("./dbService");

// registering  middleware functions
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

// Create or insert data into database
app.post("/insert", (request, response) => {
  const { name } = request.body;
  // console.log(request.body);

  // Getting database instance from dbService
  const db = dbService.getDBServiceInstance();

  // Calling the function to insert data into database
  const result = db.insertNewName(name);
  // console.log(result);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
  // console.log(data);
});

// Read or getting all data from database when page loads
app.get("/getAll", (request, response) => {
  // Getting database instance from dbService
  const db = dbService.getDBServiceInstance();

  // Calling the function to get existing data from database
  const result = db.getAllData();

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

// Update a name from the table and update database
app.patch("/update", (request, response) => {
  // console.log(request.body);
  const { id, name } = request.body;
  // console.log({id, name});
  const db = dbService.getDBServiceInstance();

  // Calling the function to update name
  const result = db.updateNameByID(id, name);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// Delete a user from the table by ID
app.delete("/delete/:id", (request, response) => {
  // console.log(request.params);
  const { id } = request.params;
  const db = dbService.getDBServiceInstance();

  // Calling the function to delete table row from database
  const result = db.deleteRowByID(id);

  result
    .then((data) => response.json({ success: data }))
    .catch((err) => console.log(err));
});

// Search a user from the table
app.get("/search/:name", (request, response) => {
  const { name } = request.params;
  const db = dbService.getDBServiceInstance();

  // Calling the function to search table by name from database
  const result = db.searchUserByName(name);

  result
    .then((data) => response.json({ data: data }))
    .catch((err) => console.log(err));
});

app.listen(process.env.PORT, () => console.log("App is running..."));
