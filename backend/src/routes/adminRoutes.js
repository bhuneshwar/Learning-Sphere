const express = require('express');
const {
  getDashboardStats,
  getAllUsers,
  updateUserRole,
  updateUserStatus,
  deleteUser,
  getAllCourses,
  deleteAnyCourse,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getPlatformAnalytics,
  getRecentActivities
} = require('../controllers/adminController');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');

const router = express.Router();

// Apply admin authentication to all routes
router.use(authMiddleware);
router.use(roleMiddleware(['Admin']));

// Dashboard routes
router.get('/dashboard/stats', getDashboardStats);
router.get('/dashboard/activities', getRecentActivities);

// User management routes
router.get('/users', getAllUsers);
router.put('/users/:id/role', updateUserRole);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:id', deleteUser);

// Course management routes
router.get('/courses', getAllCourses);
router.get('/courses/pending', getPendingCourses);
router.put('/courses/:courseId/approve', approveCourse);
router.put('/courses/:courseId/reject', rejectCourse);
router.delete('/courses/:id', deleteAnyCourse);

// Analytics routes
router.get('/analytics', getPlatformAnalytics);

module.exports = router;
