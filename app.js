const express = require("express");
require("dotenv").config();
const connDb = require("./config/Data_Connection");
const categoryRoute = require("./Routes/categoryRoute");
const userAuthRoute = require("./Routes/userAuthRoute");
const adminAuthRoute = require("./Routes/adminAuthRoute");
const errorHandler = require("./middleware/errorMiddleware");

const app = express();

// middleware body
app.use(express.json());

// JSON parsing error handling middleware
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

// Error handler middleware
app.use(errorHandler);

// listening to server
app.listen(process.env.PORT || 5000, () => {
  console.log("running");
});
