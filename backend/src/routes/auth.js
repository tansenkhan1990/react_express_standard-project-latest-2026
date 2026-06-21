import { Router } from 'express';
import { register, login, logout, getMe } from '../controllers/authController.js';
import { requireFields, validateEmail, validatePassword } from '../middleware/validate.js';
import { authenticate } from '../middleware/auth.js';
import { asyncWrapper } from '../utils/helpers.js';

const router = Router();

// POST /api/auth/register
router.post(
  '/register',
  requireFields('name', 'email', 'password'),
  validateEmail,
  validatePassword,
  asyncWrapper(register)
);

// POST /api/auth/login
router.post(
  '/login',
  requireFields('email', 'password'),
  validateEmail,
  asyncWrapper(login)
);

// POST /api/auth/logout
router.post('/logout', asyncWrapper(logout));

// GET /api/auth/me — returns current user from cookie JWT
router.get('/me', authenticate, asyncWrapper(getMe));

export default router;
