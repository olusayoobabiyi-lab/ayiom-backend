/**
 * Express error-handling middleware (4 arguments).
 * Handles ApiError, Mongoose errors, JWT errors, and defaults.
 */
export function errorHandler(err, _req, res, _next) {
  let statusCode = err.statusCode || 500;
  let message = err.message || "Internal Server Error";
  let details = err.details || null;

  // Mongoose ValidationError
  if (err.name === "ValidationError") {
    statusCode = 400;
    const fieldMessages = {};
    for (const field of Object.keys(err.errors)) {
      fieldMessages[field] = err.errors[field].message;
    }
    message = "Validation Error";
    details = fieldMessages;
  }

  // Mongoose CastError
  if (err.name === "CastError") {
    statusCode = 400;
    message = `Invalid ${err.path}: ${err.value}`;
  }

  // Mongoose duplicate key error (code 11000)
  if (err.code === 11000 || err.code === 11001) {
    statusCode = 409;
    const field = Object.keys(err.keyValue || {}).join(", ");
    message = `Duplicate value for: ${field}`;
    details = err.keyValue;
  }

  // JsonWebTokenError
  if (err.name === "JsonWebTokenError") {
    statusCode = 401;
    message = "Invalid token";
  }

  // TokenExpiredError
  if (err.name === "TokenExpiredError") {
    statusCode = 401;
    message = "Token expired";
  }

  // Sanitize default 500 messages in production
  if (statusCode === 500 && process.env.NODE_ENV === "production") {
    message = "Internal Server Error";
    details = null;
  }

  const response = { success: false, message };
  if (details) {
    response.details = details;
  }

  res.status(statusCode).json(response);
}
