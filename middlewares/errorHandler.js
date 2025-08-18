const errorHandler = (err, req, res, next) => {
  // Default status and message
  const statusCode = err.statusCode || res.statusCode || 500;
  let message = err.message || "Server Error";

  // Log error (keep minimal in production if needed)
  console.error(err);

  // Handle Mongoose bad ObjectId
  if (err.name === "CastError") {
    message = "Resource not found";
  }

  // Handle Mongoose duplicate key
  if (err.code === 11000) {
    message = "Duplicate field value entered";
  }

  // Handle Mongoose validation errors
  if (err.name === "ValidationError") {
    message = Object.values(err.errors)
      .map((val) => val.message)
      .join(", ");
  }

  res.status(statusCode).json({
    success: false,
    error: message,
  });
};

module.exports = errorHandler;