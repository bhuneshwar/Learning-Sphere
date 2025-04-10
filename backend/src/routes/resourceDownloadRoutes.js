const express = require('express');
const { 
  recordResourceDownload, 
  getCourseDownloadStats,
  getUserDownloadHistory
} = require('../controllers/resourceDownloadController');
const authMiddleware = require('../middlewares/authMiddleware');

const router = express.Router();

// Record a resource download
router.post('/record', authMiddleware, recordResourceDownload);

// Get download statistics for a course (for instructors)
router.get('/courses/:courseId/stats', authMiddleware, getCourseDownloadStats);

// Get user's download history
router.get('/history', authMiddleware, getUserDownloadHistory);

module.exports = router;