import express from 'express';
import { body } from 'express-validator';
import { register, login, getProfile, getApprentices, getUsers, getApprenticesWithStats, updateUser, deleteUser } from '../controllers/authController';
import { authenticate, authorize } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';

const router = express.Router();

// Register
router.post('/register', [
  body('name').trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('username').trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  body('role').isIn(['master', 'apprentice']).withMessage('Role must be either master or apprentice'),
  handleValidationErrors
], register);

// Login
router.post('/login', [
  body('username').optional().trim().isLength({ min: 1 }).withMessage('Username must not be empty'),
  body('email').optional().isEmail().withMessage('Please provide a valid email'),
  body('password').notEmpty().withMessage('Password is required'),
  // Custom validation: username yoki email majburiy
  body().custom((value, { req }) => {
    if (!req.body.username && !req.body.email) {
      throw new Error('Username or email is required');
    }
    return true;
  }),
  handleValidationErrors
], login);

// Get profile
router.get('/profile', authenticate, getProfile);

// Get current user (me)
router.get('/me', authenticate, getProfile);

// Get users (master only)
router.get('/users', authenticate, authorize('master'), getUsers);

// Get apprentices with stats (master only)
router.get('/apprentices/stats', authenticate, authorize('master'), getApprenticesWithStats);

// Get apprentices (master only)
router.get('/apprentices', authenticate, authorize('master'), getApprentices);

// Update user (master only)
router.patch('/users/:id', authenticate, authorize('master'), [
  body('name').optional().trim().isLength({ min: 2 }).withMessage('Name must be at least 2 characters'),
  body('username').optional().trim().isLength({ min: 3 }).withMessage('Username must be at least 3 characters'),
  body('password').optional().isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  handleValidationErrors
], updateUser);

// Delete user (master only)
router.delete('/users/:id', authenticate, authorize('master'), deleteUser);

export default router;
