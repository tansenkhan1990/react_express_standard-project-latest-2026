import { verifyToken } from '../utils/jwt.js';
import { AppError } from './errorHandler.js';

const TOKEN_COOKIE = 'auth_token';

/**
 * Express middleware that verifies the JWT from the HTTP-only cookie.
 * On success, attaches the decoded user payload to `req.user`.
 */
export function authenticate(req, _res, next) {
  const token = req.cookies?.[TOKEN_COOKIE];

  if (!token) {
    throw new AppError('Authentication required', 401);
  }

  const decoded = verifyToken(token);
  if (!decoded) {
    throw new AppError('Invalid or expired token', 401);
  }

  req.user = decoded;
  next();
}

/**
 * Name of the auth token cookie (exported for use in controllers).
 */
export const AUTH_COOKIE_NAME = TOKEN_COOKIE;

/**
 * Options for setting the HTTP-only cookie.
 */
export const AUTH_COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'lax',
  path: '/',
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
};
