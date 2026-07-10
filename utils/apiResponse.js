/**
 * ApiError — a custom error class with statusCode, message, and optional details.
 * Extends the native Error so instanceof works correctly.
 */
export class ApiError extends Error {
  constructor(statusCode, message, details = null) {
    super(message);
    this.statusCode = statusCode;
    this.details = details;
    Error.captureStackTrace(this, this.constructor);
  }
}

/**
 * Send a success response.
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {*} data
 * @param {string} [message]
 */
export function success(res, statusCode, data, message) {
  const body = { success: true, message: message || "Success", data };
  return res.status(statusCode).json(body);
}

/**
 * Send an error response.
 * @param {import("express").Response} res
 * @param {number} statusCode
 * @param {string} message
 * @param {*} [details]
 */
export function error(res, statusCode, message, details) {
  const body = { success: false, message };
  if (details !== undefined) {
    body.details = details;
  }
  return res.status(statusCode).json(body);
}
