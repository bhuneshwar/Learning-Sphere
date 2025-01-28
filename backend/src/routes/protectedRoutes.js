// src/routes/protectedRoutes.js
const express = require('express');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { getUsersByRole } = require('../controllers/userController');
const { createCourse } = require('../controllers/courseController');
const router = express.Router();

// Route to get users by role
router.get('/users/:role', authMiddleware, roleMiddleware('Admin'), getUsersByRole);

// Instructor-only route to create a course
router.post('/create-course', authMiddleware, roleMiddleware('Instructor'), createCourse);

module.exports = router;