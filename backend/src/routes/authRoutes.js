// src/routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { 
  register, 
  login, 
  verifyEmail, 
  forgotPassword, 
  getUserProfile, 
  updateUserProfile 
} = require('../controllers/authController');
const { validateRegisterInput } = require('../middlewares/validateInput');

const router = express.Router();

// Public routes
router.post('/register', validateRegisterInput, register);
router.post('/login', login);
router.post('/verify-email', verifyEmail);
router.post('/forgot-password', forgotPassword);

// Protected routes
router.get('/profile', authMiddleware, getUserProfile);
router.put('/profile', authMiddleware, updateUserProfile);

// Admin routes
router.get('/admin', authMiddleware, roleMiddleware('Admin'), (req, res) => {
  res.send('Welcome Admin');
});

module.exports = router;