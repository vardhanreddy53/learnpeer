import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect, admin } from '../middleware/authMiddleware.js';
import User from '../models/userModel.js';
import jwt from 'jsonwebtoken';

const router = express.Router();

// @desc    Auth user & get token
// @route   POST /api/users/login
// @access  Public
router.post('/login', asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email })
    .populate('enrolledCourses')
    .populate('teachingCourses');

  if (user && (await user.matchPassword(password))) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      certifications: user.certifications,
      enrolledCourses: user.enrolledCourses,
      teachingCourses: user.teachingCourses,
      isValidatedTeacher: user.isValidatedTeacher,
      teacherCredentials: user.teacherCredentials,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      }),
    });
  } else {
    res.status(401);
    throw new Error('Invalid email or password');
  }
}));

// @desc    Register a new user
// @route   POST /api/users
// @access  Public
router.post('/', asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  const userExists = await User.findOne({ email });

  if (userExists) {
    res.status(400);
    throw new Error('User already exists');
  }

  const user = await User.create({
    name,
    email,
    password,
    certifications: [],
    enrolledCourses: [],
    teachingCourses: [],
    isValidatedTeacher: false
  });

  if (user) {
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      certifications: user.certifications,
      enrolledCourses: user.enrolledCourses,
      teachingCourses: user.teachingCourses,
      isValidatedTeacher: user.isValidatedTeacher,
      token: jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
        expiresIn: '30d',
      }),
    });
  } else {
    res.status(400);
    throw new Error('Invalid user data');
  }
}));

// @desc    Get user profile
// @route   GET /api/users/profile
// @access  Private
router.get('/profile', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id)
    .populate('enrolledCourses')
    .populate('teachingCourses');

  if (user) {
    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      certifications: user.certifications,
      enrolledCourses: user.enrolledCourses,
      teachingCourses: user.teachingCourses,
      isValidatedTeacher: user.isValidatedTeacher,
      teacherCredentials: user.teacherCredentials,
    });
  } else {
    res.status(404);
    throw new Error('User not found');
  }
}));

// @desc    Submit teacher credentials
// @route   POST /api/users/:id/teacher-credentials
// @access  Private
router.post('/:id/teacher-credentials', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  user.teacherCredentials = {
    ...req.body,
    validationStatus: 'pending',
    submittedAt: Date.now(),
  };

  const updatedUser = await user.save();
  res.json(updatedUser);
}));

// @desc    Validate teacher
// @route   PUT /api/users/:id/validate-teacher
// @access  Private/Admin
router.put('/:id/validate-teacher', protect, admin, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  user.isValidatedTeacher = req.body.isApproved;
  if (user.teacherCredentials) {
    user.teacherCredentials.validationStatus = req.body.isApproved ? 'approved' : 'rejected';
    user.teacherCredentials.validationDate = Date.now();
  }

  const updatedUser = await user.save();
  res.json(updatedUser);
}));

// @desc    Add certification
// @route   POST /api/users/:id/certifications
// @access  Private
router.post('/:id/certifications', protect, asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);

  if (!user) {
    res.status(404);
    throw new Error('User not found');
  }

  if (req.user._id.toString() !== req.params.id) {
    res.status(403);
    throw new Error('Not authorized');
  }

  const { subject, score } = req.body;
  
  const certification = {
    subject,
    score,
    issuedDate: new Date(),
    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // 1 year validity
    status: 'active'
  };

  user.certifications.push(certification);
  const updatedUser = await user.save();
  res.json(updatedUser);
}));

export default router;