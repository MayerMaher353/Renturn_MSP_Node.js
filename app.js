const express = require("express");
require("dotenv").config();
const connDb = require("./config/Data_Connection");
const categoryRoute = require("./Routes/categoryRoute");
const productRoute = require("./Routes/productRoute");
const userAuthRoute = require("./Routes/userAuthRoute");
const adminAuthRoute = require("./Routes/adminAuthRoute");
const errorHandler = require("./middlewares/errorMiddleware");

const app = express();

// middleware body
app.use(express.json());

// JSON parsing error handling middleware - MUST be after express.json()
app.use((err, req, res, next) => {
  if (err instanceof SyntaxError && err.status === 400 && "body" in err) {
    return res.status(400).json({
      success: false,
      error: "Invalid JSON format. Please check your request body syntax.",
    });
  }
  next();
});

// connected to db
connDb();

// mount routes
app.use("/api/v1/categories", categoryRoute);
app.use("/api/v1/auth", userAuthRoute);
app.use("/api/v1/admin", adminAuthRoute);
app.use("/api/v1/products", productRoute);

// Error handler middleware
app.use(errorHandler);

// listening to server
app.listen(process.env.PORT || 5000, () => {
  console.log("Server running on port", process.env.PORT || 5000);
});
