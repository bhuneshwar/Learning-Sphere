// src/controllers/userController.js
const User = require('../models/userModel');

const getUsersByRole = async (req, res) => {
    try {
      const { role } = req.params;
      if (!['Admin', 'Instructor', 'Learner'].includes(role)) {
        return res.status(400).json({ message: 'Invalid role' });
      }
      const users = await User.find({ role });
      res.json(users);
    } catch (err) {
      res.status(500).json({ message: 'Server Error', error: err.message });
    }
  };

module.exports = { getUsersByRole };