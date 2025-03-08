import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import upload from '../middleware/uploadMiddleware.js';
import { uploadToCloudinary, deleteFromCloudinary } from '../config/cloudinary.js';

const router = express.Router();

// @desc    Upload file to Cloudinary
// @route   POST /api/upload
// @access  Private
router.post('/', protect, upload.single('file'), asyncHandler(async (req, res) => {
  if (!req.file) {
    res.status(400);
    throw new Error('No file uploaded');
  }

  try {
    const result = await uploadToCloudinary(req.file.path, 'student_uploads');
    res.json({
      url: result.secure_url,
      publicId: result.public_id
    });
  } catch (error) {
    res.status(500);
    throw new Error('Error uploading file to Cloudinary');
  }
}));

// @desc    Delete file from Cloudinary
// @route   DELETE /api/upload/:publicId
// @access  Private
router.delete('/:publicId', protect, asyncHandler(async (req, res) => {
  try {
    const result = await deleteFromCloudinary(req.params.publicId);
    res.json({ message: 'File deleted successfully' });
  } catch (error) {
    res.status(500);
    throw new Error('Error deleting file from Cloudinary');
  }
}));

export default router;