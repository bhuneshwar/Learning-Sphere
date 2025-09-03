const express = require('express');
const {
  createChatSession,
  getUserSessions,
  getChatSession,
  sendMessage,
  deleteChatSession,
  generateCourseSummary,
  generateSuggestedQuestions,
  getUserAnalytics,
  getAIServiceStatus,
  getServiceStats
} = require('../controllers/aiController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Rate limiting middleware for AI endpoints (to prevent abuse)
const rateLimit = require('express-rate-limit');

// Rate limit for AI message sending (more restrictive)
const aiMessageLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 50, // Limit each user to 50 requests per windowMs
  message: {
    success: false,
    message: 'Too many AI requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Rate limit for other AI endpoints (less restrictive)
const aiGeneralLimit = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each user to 100 requests per windowMs
  message: {
    success: false,
    message: 'Too many requests. Please try again later.'
  },
  standardHeaders: true,
  legacyHeaders: false,
});

// Chat session management routes
router.post('/sessions', authMiddleware, aiGeneralLimit, createChatSession);
router.get('/sessions', authMiddleware, aiGeneralLimit, getUserSessions);
router.get('/sessions/:sessionId', authMiddleware, aiGeneralLimit, getChatSession);
router.delete('/sessions/:sessionId', authMiddleware, aiGeneralLimit, deleteChatSession);

// Message sending route (with stricter rate limiting)
router.post('/sessions/:sessionId/messages', authMiddleware, aiMessageLimit, sendMessage);

// Course-related AI features
router.get('/courses/:courseId/summary', authMiddleware, aiGeneralLimit, generateCourseSummary);
router.get('/courses/:courseId/questions', authMiddleware, aiGeneralLimit, generateSuggestedQuestions);

// Analytics and status
router.get('/analytics', authMiddleware, aiGeneralLimit, getUserAnalytics);
router.get('/status', authMiddleware, getAIServiceStatus);

// Admin routes
router.get('/admin/stats', authMiddleware, getServiceStats);

module.exports = router;
