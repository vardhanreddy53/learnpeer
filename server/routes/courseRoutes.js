import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Course from '../models/courseModel.js';

const router = express.Router();

// @desc    Fetch all courses
// @route   GET /api/courses
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const courses = await Course.find({});
  res.json(courses);
}));

// @desc    Fetch single course
// @route   GET /api/courses/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);
  
  if (course) {
    res.json(course);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
}));

// @desc    Create a course
// @route   POST /api/courses
// @access  Private/Teacher
router.post('/', protect, asyncHandler(async (req, res) => {
  if (!req.user.isValidatedTeacher) {
    res.status(403);
    throw new Error('Only validated teachers can create courses');
  }

  const course = new Course({
    ...req.body,
    instructorId: req.user._id,
    instructorName: req.user.name,
  });

  const createdCourse = await course.save();
  res.status(201).json(createdCourse);
}));

// @desc    Update a course
// @route   PUT /api/courses/:id
// @access  Private/Teacher
router.put('/:id', protect, asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.instructorId.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error('Only the course instructor can update this course');
    }

    Object.assign(course, req.body);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
}));

// @desc    Enroll in a course
// @route   POST /api/courses/:id/enroll
// @access  Private
router.post('/:id/enroll', protect, asyncHandler(async (req, res) => {
  const course = await Course.findById(req.params.id);

  if (course) {
    if (course.enrolledStudents.includes(req.user._id)) {
      res.status(400);
      throw new Error('Already enrolled in this course');
    }

    course.enrolledStudents.push(req.user._id);
    const updatedCourse = await course.save();
    res.json(updatedCourse);
  } else {
    res.status(404);
    throw new Error('Course not found');
  }
}));

export default router;