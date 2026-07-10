/**
 * Wraps an async route handler to catch any rejected promises and
 * forward them to Express's error handler via next(err).
 */
export const asyncHandler = (fn) => (req, res, next) =>
  Promise.resolve(fn(req, res, next)).catch(next);

export default asyncHandler;
