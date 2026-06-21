import { AppError } from './errorHandler.js';

/**
 * Middleware factory that validates the presence of required fields in req.body.
 * @param  {...string} fields - Required field names
 * @returns {Function} Express middleware
 */
export function requireFields(...fields) {
  return (req, _res, next) => {
    const missing = fields.filter((f) => !req.body[f] || !req.body[f].trim());
    if (missing.length > 0) {
      throw new AppError(
        `Missing required fields: ${missing.join(', ')}`
      );
    }
    next();
  };
}

/**
 * Validates email format.
 */
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

/**
 * Middleware to validate email format.
 */
export function validateEmail(req, _res, next) {
  const { email } = req.body;
  if (email && !isValidEmail(email)) {
    throw new AppError('Invalid email format');
  }
  next();
}

/**
 * Middleware to validate password minimum length.
 */
export function validatePassword(req, _res, next) {
  const { password } = req.body;
  if (password && password.length < 6) {
    throw new AppError('Password must be at least 6 characters');
  }
  next();
}
