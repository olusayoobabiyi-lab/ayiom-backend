import { ApiError } from "../utils/apiResponse.js";

/**
 * Factory that creates a middleware function which checks
 * req.user.role against a list of allowed roles.
 * Throws ApiError(403) if the user's role is not allowed.
 */
export const requireRole =
  (...allowedRoles) =>
  (req, _res, next) => {
    if (!req.user || !req.user.role) {
      throw new ApiError(403, "Forbidden");
    }

    if (!allowedRoles.includes(req.user.role)) {
      throw new ApiError(403, "Forbidden");
    }

    next();
  };
