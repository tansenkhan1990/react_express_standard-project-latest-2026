import bcrypt from 'bcryptjs';
import User from '../models/userModel.js';
import { AppError } from '../middleware/errorHandler.js';
import { generateToken } from '../utils/jwt.js';
import { AUTH_COOKIE_NAME, AUTH_COOKIE_OPTIONS } from '../middleware/auth.js';

const SALT_ROUNDS = 10;

/**
 * Set the HTTP-only cookie with a JWT for the given user.
 * The JWT payload contains the user's MongoDB `id` and email.
 */
function setAuthCookie(res, user) {
  const token = generateToken({ id: user.id, email: user.email });
  res.cookie(AUTH_COOKIE_NAME, token, AUTH_COOKIE_OPTIONS);
}

/**
 * Clear the auth cookie (for logout).
 */
function clearAuthCookie(res) {
  res.clearCookie(AUTH_COOKIE_NAME, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
  });
}

/**
 * POST /api/auth/register
 * Creates a new user account and sets an auth cookie.
 */
export async function register(req, res) {
  const { name, email, password } = req.body;

  // Check for duplicate email
  const existing = await User.findOne({ email: email.toLowerCase().trim() });
  if (existing) {
    throw new AppError('An account with this email already exists', 409);
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, SALT_ROUNDS);

  // Create user
  const user = await User.create({
    name: name.trim(),
    email: email.toLowerCase().trim(),
    password: hashedPassword,
  });

  // Set auth cookie and return user data
  setAuthCookie(res, user);
  res.status(201).json(user.toJSON());
}

/**
 * POST /api/auth/login
 * Authenticates a user and sets an auth cookie.
 */
export async function login(req, res) {
  const { email, password } = req.body;

  // Need to explicitly select password since it's excluded by default in toJSON
  const user = await User.findOne({ email: email.toLowerCase().trim() }).select('+password');

  if (!user) {
    throw new AppError('Invalid email or password', 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) {
    throw new AppError('Invalid email or password', 401);
  }

  // Set auth cookie and return user data
  setAuthCookie(res, user);
  res.json(user.toJSON());
}

/**
 * POST /api/auth/logout
 * Clears the auth cookie.
 */
export async function logout(_req, res) {
  clearAuthCookie(res);
  res.json({ message: 'Logged out successfully' });
}

/**
 * GET /api/auth/me
 * Returns the currently authenticated user (requires auth middleware).
 * Used by the frontend to restore session on page load.
 */
export async function getMe(req, res) {
  const user = await User.findById(req.user.id);

  if (!user) {
    clearAuthCookie(res);
    throw new AppError('User not found', 404);
  }

  res.json(user.toJSON());
}
