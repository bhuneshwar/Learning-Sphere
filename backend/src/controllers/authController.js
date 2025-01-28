const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/userModel');

// Register a new user
const register = async (req, res) => {
  try {
    const { username, password, role } = req.body;
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    // Create new user
    const newUser = await User.create({ username, password: hashedPassword, role });
    res.status(201).json({ message: 'User registered successfully', user: newUser });
  } catch (err) {
    res.status(400).json({ message: 'Error registering user', error: err.message });
  }
};

// Login user
const login = async (req, res) => {
  try {
    const { username, password } = req.body;
    const user = await User.findOne({ username }); // Ensure this query works

    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' }); // User not found
    }

    const isMatch = await bcrypt.compare(password, user.password); // Compare passwords
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' }); // Incorrect password
    }

    // Generate JWT
    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
      expiresIn: '1h',
    });

    // Respond with token and user data
    res.json({
      token,
      user: { username: user.username, role: user.role },
    });
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};



module.exports = { register, login };