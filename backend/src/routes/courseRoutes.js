const express = require('express');
const { 
  createCourse, 
  enrollInCourse, 
  getCourses, 
  getCourseById,
  updateCourse,
  deleteCourse, 
  addSection, 
  addLesson,
  updateLesson,
  trackProgress,
  addResourcesToLesson,
  submitQuiz,
  getCourseProgress,
  markLessonComplete
} = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { courseResourceUpload } = require('../config/cloudinary');

const router = express.Router();

// Middleware for handling file upload errors
const handleFileUploadError = (err, req, res, next) => {
  if (err) {
    if (err.message.includes('File too large')) {
      return res.status(400).json({
        success: false,
        message: 'File size too large. Maximum size per file is 50MB.'
      });
    }
    
    return res.status(400).json({
      success: false,
      message: err.message
    });
  }
  next();
};

// Course management routes
router.post('/', 
  authMiddleware, 
  courseResourceUpload.array('courseResources', 10), // Accept up to 10 files
  handleFileUploadError,
  createCourse
); // Create a course with file uploads
router.get('/', getCourses); // Fetch all courses (public)
router.get('/:id', authMiddleware, getCourseById); // Get course details
router.put('/:id', authMiddleware, updateCourse); // Update course details
router.delete('/:id', authMiddleware, deleteCourse); // Delete a course

// Course content management routes
router.post('/:id/sections', authMiddleware, addSection); // Add a section to a course
router.post('/:courseId/sections/:sectionId/lessons', authMiddleware, addLesson); // Add a lesson to a section
router.put('/:courseId/sections/:sectionId/lessons/:lessonId', authMiddleware, updateLesson); // Update a lesson

// Enrollment and progress tracking
router.post('/:id/enroll', authMiddleware, enrollInCourse); // Enroll in a course
router.post('/:courseId/progress/:lessonId', authMiddleware, trackProgress); // Track progress in a course
router.get('/:courseId/progress', authMiddleware, getCourseProgress); // Get user progress for a course
router.post('/:courseId/lessons/:sectionIndex/:lessonIndex/complete', authMiddleware, markLessonComplete); // Mark a lesson as complete

// Resource management
router.post('/:courseId/sections/:sectionId/lessons/:lessonId/resources', authMiddleware, addResourcesToLesson); // Add resources to a lesson

// Quiz submission
router.post('/:courseId/sections/:sectionId/lessons/:lessonId/submit-quiz', authMiddleware, submitQuiz); // Submit quiz answers

module.exports = router;