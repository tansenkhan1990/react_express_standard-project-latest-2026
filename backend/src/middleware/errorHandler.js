/**
 * Creates an error with an HTTP status code.
 * Can be used with or without `new`.
 *
 * @param {string} message - Human-readable error message
 * @param {number} statusCode - HTTP status code (default 400)
 * @returns {Error}
 */
export function AppError(message, statusCode = 400) {
  const err = new Error(message);
  err.name = 'AppError';
  err.statusCode = statusCode;
  return err;
}

/**
 * Global error-handling middleware for Express.
 * Catches all unhandled errors and returns a consistent JSON response.
 */
export function errorHandler(err, _req, res, _next) {
  const statusCode = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  if (statusCode === 500) {
    console.error('[ERROR]', err);
  }

  res.status(statusCode).json({
    error: message,
  });
}
