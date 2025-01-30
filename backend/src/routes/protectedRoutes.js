// src/routes/protectedRoutes.js
const express = require('express');
const roleMiddleware = require('../middlewares/roleMiddleware');
const authMiddleware = require('../middlewares/authMiddleware');
const { getUsersByRole } = require('../controllers/userController');
const { createCourse } = require('../controllers/courseController');
const { getAllUsers, updateUserRole, deleteUser, getAllCourses, deleteAnyCourse } = require('../controllers/adminController');
const router = express.Router();


// Admin-only routes
router.get('/admin/users', authMiddleware, roleMiddleware('Admin'), getAllUsers);
router.put('/admin/users/:id', authMiddleware, roleMiddleware('Admin'), updateUserRole);
router.delete('/admin/users/:id', authMiddleware, roleMiddleware('Admin'), deleteUser);

router.get('/admin/courses', authMiddleware, roleMiddleware('Admin'), getAllCourses);
router.delete('/admin/courses/:id', authMiddleware, roleMiddleware('Admin'), deleteAnyCourse);

// Route to get users by role
router.get('/users/:role', authMiddleware, roleMiddleware('Admin'), getUsersByRole);

// Instructor-only route to create a course
router.post('/create-course', authMiddleware, roleMiddleware('Instructor'), createCourse);

module.exports = router;