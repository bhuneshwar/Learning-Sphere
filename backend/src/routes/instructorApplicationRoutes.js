const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const {
  submitInstructorApplication,
  getInstructorApplicationStatus,
  getPendingApplications,
  approveInstructorApplication,
  rejectInstructorApplication,
  getApplicationStats
} = require('../controllers/instructorApplicationController');

const router = express.Router();

// Routes for learners/users
router.post('/apply', authMiddleware, submitInstructorApplication);
router.get('/status', authMiddleware, getInstructorApplicationStatus);

// Routes for admins only
router.get('/pending', authMiddleware, roleMiddleware('Admin'), getPendingApplications);
router.post('/:userId/approve', authMiddleware, roleMiddleware('Admin'), approveInstructorApplication);
router.post('/:userId/reject', authMiddleware, roleMiddleware('Admin'), rejectInstructorApplication);
router.get('/stats', authMiddleware, roleMiddleware('Admin'), getApplicationStats);

module.exports = router;
