const express = require("express");
require("dotenv").config();
const connDb = require("./config/Data_Connection");
const categoryRoute = require("./Routes/categoryRoute");

const app = express();

// middleware body
app.use(express.json());

// connected to db
connDb();

// mount routes
app.use("/api/v1/categories", categoryRoute);


// listening to server
app.listen(process.env.PORT || 5000, () => {
  console.log("running");
});
