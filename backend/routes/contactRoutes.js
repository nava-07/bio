import express from 'express';
import {
  createContact,
  getContacts,
  markContactRead,
  deleteContact
} from '../controllers/contactController.js';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

router.route('/')
  .post(createContact)
  .get(protect, admin, getContacts);

router.route('/:id')
  .put(protect, admin, markContactRead)
  .delete(protect, admin, deleteContact);

export default router;
