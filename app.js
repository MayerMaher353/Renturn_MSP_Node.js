const express = require("express");
require("dotenv").config();
const connDb = require("./config/Data_Connection");
const categoryRoute = require("./Routes/categoryRoute");
const errorHandler = require("./middlewares/errorHandler");
const productRoute =require("./Routes/productRoute")

const app = express();
//Error handler middleware
app.use(errorHandler);

// middleware body
app.use(express.json());

// connected to db
connDb();

// mount routes
app.use("/api/v1/categories", categoryRoute);

/**
 *  @description CRUD products
 *  @route /api/v1/products or /api/v1/products/:id
 */
app.use("/api/v1/products",productRoute)
// listening to server
app.listen(process.env.PORT || 5000, () => {
  console.log("running");
});
