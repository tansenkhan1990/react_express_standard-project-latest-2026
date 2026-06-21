import User from '../models/userModel.js';
import { AppError } from '../middleware/errorHandler.js';

/**
 * GET /api/users/:id
 * Returns a user by ID (password excluded via toJSON transform).
 */
export async function getUserById(req, res) {
  const { id } = req.params;

  const user = await User.findById(id);

  if (!user) {
    throw new AppError('User not found', 404);
  }

  res.json(user.toJSON());
}
