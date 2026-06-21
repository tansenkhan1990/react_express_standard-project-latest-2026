/**
 * Wraps an async Express route handler to catch rejected promises
 * and forward them to the error-handling middleware.
 *
 * @param {Function} fn - Async route handler (req, res, next)
 * @returns {Function} Wrapped handler
 */
export function asyncWrapper(fn) {
  return (req, res, next) => {
    Promise.resolve(fn(req, res, next)).catch(next);
  };
}
