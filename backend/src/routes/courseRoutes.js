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
  trackProgress
} = require('../controllers/courseController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Course management routes
router.post('/', authMiddleware, createCourse); // Create a course
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

module.exports = router;