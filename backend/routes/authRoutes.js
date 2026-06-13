import express from 'express';
import {
  authUser,
  registerUser,
  logoutUser,
  getUserProfile,
  seedAdmin
} from '../controllers/authController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.get('/seed', seedAdmin);

router.post('/register', registerUser);
router.post('/login', authUser);
router.post('/logout', logoutUser);
router.get('/profile', protect, getUserProfile);

export default router;
