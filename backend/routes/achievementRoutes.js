import express from 'express';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement
} from '../controllers/achievementController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getAchievements)
  .post(protect, admin, createAchievement);

router.route('/:id')
  .get(getAchievementById)
  .put(protect, admin, updateAchievement)
  .delete(protect, admin, deleteAchievement);

export default router;
