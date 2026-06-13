import express from 'express';
import multer from 'multer';
import path from 'path';
import { protect, admin } from '../middleware/authMiddleware.js';

const router = express.Router();

const storage = multer.diskStorage({
  destination(req, file, cb) {
    cb(null, 'uploads/');
  },
  filename(req, file, cb) {
    // Keep the original name in the file name for download purposes
    // e.g. 1629837129-My_Resume.pdf
    const safeName = file.originalname.replace(/[^a-zA-Z0-9.\-_]/g, '_');
    cb(null, `${Date.now()}-${safeName}`);
  },
});

const upload = multer({
  storage
});

import fs from 'fs';

router.post('/', protect, admin, upload.single('image'), (req, res) => {
  if (!req.file) return res.status(400).send('No file uploaded');
  res.send(`/${req.file.path.replace(/\\/g, '/')}`);
});

router.delete('/', protect, admin, (req, res) => {
  const filePath = req.body.filePath;
  if (!filePath) return res.status(400).send('File path is required');
  
  // Remove the leading slash if it exists
  const relativePath = filePath.startsWith('/') ? filePath.substring(1) : filePath;
  const fullPath = path.resolve(relativePath);
  
  // Ensure the path is within the uploads directory to prevent directory traversal
  if (!fullPath.startsWith(path.resolve('uploads'))) {
    return res.status(403).send('Invalid file path');
  }

  fs.unlink(fullPath, (err) => {
    if (err) {
      console.error(err);
      return res.status(500).send('Failed to delete file');
    }
    res.send({ message: 'File deleted successfully' });
  });
});

export default router;
