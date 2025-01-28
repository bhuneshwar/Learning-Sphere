const express = require('express');
const { createCourse, enrollInCourse, getCourses } = require('../controllers/courseController')
const authMiddleware = require('../middlewares/authMiddleware');
const router = express.Router();
router.post('/', authMiddleware, createCourse); // Create a course
router.post('/:id/enroll', authMiddleware, enrollInCourse); // Enroll in a 
course
router.get('/', authMiddleware, getCourses); // Fetch all courses
router.delete('/:id', authMiddleware, deleteCourse)
module.exports = router;