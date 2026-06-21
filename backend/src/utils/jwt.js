import jwt from 'jsonwebtoken';
import config from '../config/index.js';

/**
 * Generate a JWT access token for a user.
 * @param {object} payload - Data to encode (e.g. { id, email })
 * @returns {string} Signed JWT token
 */
export function generateToken(payload) {
  return jwt.sign(payload, config.jwtSecret, {
    expiresIn: config.jwtExpiresIn,
  });
}

/**
 * Verify and decode a JWT token.
 * @param {string} token
 * @returns {object|null} Decoded payload, or null if invalid/expired
 */
export function verifyToken(token) {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch {
    return null;
  }
}
