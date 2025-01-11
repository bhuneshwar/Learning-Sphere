const express = require('express');
const protect = require('../middlewares/authMiddleware');

const router = express.Router();

router.get('/dashboard', protect, (req, res) => {
  res.json({ message: `Welcome ${req.user.id}` });
});

module.exports = router;
