import { Router } from 'express';
import { getUserById } from '../controllers/userController.js';
import { authenticate } from '../middleware/auth.js';
import { asyncWrapper } from '../utils/helpers.js';

const router = Router();

// GET /api/users/:id — protected
router.get('/:id', authenticate, asyncWrapper(getUserById));

export default router;
