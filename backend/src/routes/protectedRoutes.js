// src/routes/protectedRoutes.js
const express = require('express');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { getUsersByRole } = require('../controllers/userController');
const router = express.Router();

// Route to get users by role
router.get('/users/:role', roleMiddleware('Admin'), getUsersByRole);

module.exports = router;