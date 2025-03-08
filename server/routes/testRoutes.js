import express from 'express';
import asyncHandler from 'express-async-handler';
import { protect } from '../middleware/authMiddleware.js';
import Test from '../models/testModel.js';

const router = express.Router();

// @desc    Fetch all tests
// @route   GET /api/tests
// @access  Public
router.get('/', asyncHandler(async (req, res) => {
  const tests = await Test.find({});
  res.json(tests);
}));

// @desc    Fetch single test
// @route   GET /api/tests/:id
// @access  Public
router.get('/:id', asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  
  if (test) {
    res.json(test);
  } else {
    res.status(404);
    throw new Error('Test not found');
  }
}));

// @desc    Create a test result
// @route   POST /api/tests/:id/results
// @access  Private
router.post('/:id/results', protect, asyncHandler(async (req, res) => {
  const test = await Test.findById(req.params.id);
  
  if (!test) {
    res.status(404);
    throw new Error('Test not found');
  }
  
  const { answers } = req.body;
  
  if (!answers || !Array.isArray(answers)) {
    res.status(400);
    throw new Error('Invalid answers format');
  }
  
  // Calculate score
  let correctAnswers = 0;
  test.questions.forEach((question, index) => {
    if (answers[index] === question.correctOptionIndex) {
      correctAnswers++;
    }
  });
  
  const score = Math.round((correctAnswers / test.questions.length) * 100);
  const passed = score >= test.passingScore;
  
  const result = await TestResult.create({
    userId: req.user._id,
    testId: test._id,
    subject: test.subject,
    score,
    passed,
    answers,
    completedAt: Date.now()
  });
  
  res.status(201).json(result);
}));

// @desc    Get user's test results
// @route   GET /api/tests/results/user/:userId
// @access  Private
router.get('/results/user/:userId', protect, asyncHandler(async (req, res) => {
  // Ensure user can only access their own results
  if (req.user._id.toString() !== req.params.userId) {
    res.status(403);
    throw new Error('Not authorized to access these results');
  }
  
  const results = await TestResult.find({ userId: req.params.userId })
    .sort({ completedAt: -1 });
  
  res.json(results);
}));

// @desc    Get specific test result
// @route   GET /api/tests/results/:resultId
// @access  Private
router.get('/results/:resultId', protect, asyncHandler(async (req, res) => {
  const result = await TestResult.findById(req.params.resultId);
  
  if (!result) {
    res.status(404);
    throw new Error('Test result not found');
  }
  
  // Ensure user can only access their own results
  if (result.userId.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error('Not authorized to access this result');
  }
  
  res.json(result);
}));

export default router;