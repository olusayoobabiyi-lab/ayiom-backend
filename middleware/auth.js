import { ApiError } from "../utils/apiResponse.js";
import { verifyToken } from "../utils/jwt.js";

/**
 * Authenticate request by reading either:
 *   - Authorization: Bearer <token> header
 *   - req.cookies.token
 *
 * Attaches { id, role } to req.user on success.
 * Throws ApiError(401) on failure.
 */
export function authenticate(req, _res, next) {
  try {
    let token = null;

    // Check Authorization header
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
      token = authHeader.split(" ")[1];
    }

    // Fall back to cookie
    if (!token && req.cookies && req.cookies.token) {
      token = req.cookies.token;
    }

    if (!token) {
      throw new ApiError(401, "Not authenticated");
    }

    const decoded = verifyToken(token);
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    next(err);
  }
}
