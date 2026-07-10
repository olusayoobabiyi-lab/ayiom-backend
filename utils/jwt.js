import jwt from "jsonwebtoken";
import { env } from "../config/env.js";

/**
 * Sign a JWT token with the given payload.
 * Defaults to env.JWT_EXPIRES_IN for the expiry.
 * @param {object} payload — must include at least { id, role }
 * @param {object} [options] — additional jwt options
 * @returns {string}
 */
export function signToken(payload, options = {}) {
  return jwt.sign(payload, env.JWT_SECRET, {
    expiresIn: env.JWT_EXPIRES_IN,
    ...options,
  });
}

/**
 * Verify a JWT token and return the decoded payload.
 * Throws on invalid / expired tokens.
 * @param {string} token
 * @returns {object} decoded payload
 */
export function verifyToken(token) {
  return jwt.verify(token, env.JWT_SECRET);
}
