import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Subject from '../models/subjectModel.js';

const router = express.Router();

// @desc    Fetch all subjects
// @route   GET /api/subjects
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const subjects = await Subject.find({});
  res.json(subjects);
}));

// @desc    Fetch single subject
// @route   GET /api/subjects/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);
  
  if (subject) {
    res.json(subject);
  } else {
    res.status(404);
    throw new Error('Subject not found');
  }
}));

// @desc    Add demo video to subject
// @route   POST /api/subjects/:id/demo-videos
// @access  Private/Teacher
router.post('/:id/demo-videos', protect, asyncHandler(async (req, res) => {
  const subject = await Subject.findById(req.params.id);

  if (!req.user.isValidatedTeacher) {
    res.status(403);
    throw new Error('Only validated teachers can add demo videos');
  }

  if (subject) {
    const newVideo = {
      ...req.body,
      instructorId: req.user._id,
      instructorName: req.user.name,
      uploadDate: Date.now(),
    };

    subject.demoVideos.push(newVideo);
    const updatedSubject = await subject.save();
    res.json(updatedSubject);
  } else {
    res.status(404);
    throw new Error('Subject not found');
  }
}));

export default router;