import express from 'express';
import {
  getExperiences,
  createExperience,
  updateExperience,
  deleteExperience
} from '../controllers/experienceController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .get(getExperiences)
  .post(protect, admin, createExperience);

router.route('/:id')
  .put(protect, admin, updateExperience)
  .delete(protect, admin, deleteExperience);

export default router;
