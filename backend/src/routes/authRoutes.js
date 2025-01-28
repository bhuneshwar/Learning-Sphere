// src/routes/authRoutes.js
const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const roleMiddleware = require('../middlewares/roleMiddleware');
const { register, login } = require('../controllers/authController');

const router = express.Router();

router.post('/register', register);
router.post('/login', login);

// Protected routes
router.get('/admin', authMiddleware, roleMiddleware('Admin'), (req, res) => {
  res.send('Welcome Admin');
});

module.exports = router;