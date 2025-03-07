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

// Get user profile by ID
const getUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id; // Get from params or from authenticated user
    const user = await User.findById(userId).select('-password');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Update user profile
const updateUserProfile = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const updates = req.body;
    
    // Fields that are allowed to be updated
    const allowedUpdates = [
      'firstName', 'lastName', 'bio', 'profilePicture',
      'skills', 'interests', 'socialLinks', 'preferences'
    ];
    
    // Filter out fields that are not allowed to be updated
    const filteredUpdates = Object.keys(updates)
      .filter(key => allowedUpdates.includes(key))
      .reduce((obj, key) => {
        obj[key] = updates[key];
        return obj;
      }, {});
    
    // Calculate profile completeness
    let completenessScore = 0;
    const totalFields = 8; // Count of important profile fields
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Calculate completeness based on filled fields
    if (user.firstName) completenessScore++;
    if (user.lastName) completenessScore++;
    if (user.bio && user.bio.length > 10) completenessScore++;
    if (user.profilePicture) completenessScore++;
    if (user.skills && user.skills.length > 0) completenessScore++;
    if (user.interests && user.interests.length > 0) completenessScore++;
    if (user.socialLinks && Object.values(user.socialLinks).some(link => link)) completenessScore++;
    if (user.preferences) completenessScore++;
    
    // Update with new values from request
    Object.keys(filteredUpdates).forEach(key => {
      if (key === 'firstName' && filteredUpdates.firstName && !user.firstName) completenessScore++;
      if (key === 'lastName' && filteredUpdates.lastName && !user.lastName) completenessScore++;
      if (key === 'bio' && filteredUpdates.bio && filteredUpdates.bio.length > 10 && (!user.bio || user.bio.length <= 10)) completenessScore++;
      if (key === 'profilePicture' && filteredUpdates.profilePicture && !user.profilePicture) completenessScore++;
      if (key === 'skills' && filteredUpdates.skills && filteredUpdates.skills.length > 0 && (!user.skills || user.skills.length === 0)) completenessScore++;
      if (key === 'interests' && filteredUpdates.interests && filteredUpdates.interests.length > 0 && (!user.interests || user.interests.length === 0)) completenessScore++;
      if (key === 'socialLinks' && filteredUpdates.socialLinks && Object.values(filteredUpdates.socialLinks).some(link => link) && (!user.socialLinks || !Object.values(user.socialLinks).some(link => link))) completenessScore++;
    });
    
    // Ensure score doesn't exceed 100%
    const profileCompleteness = Math.min(Math.round((completenessScore / totalFields) * 100), 100);
    
    // Update the user with filtered updates and completeness score
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { ...filteredUpdates, profileCompleteness },
      { new: true, runValidators: true }
    ).select('-password');
    
    res.json(updatedUser);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

// Add achievement to user profile
const addAchievement = async (req, res) => {
  try {
    const userId = req.params.id || req.user.id;
    const { title, description, badge } = req.body;
    
    if (!title) {
      return res.status(400).json({ message: 'Achievement title is required' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    const newAchievement = {
      title,
      description: description || '',
      dateEarned: new Date(),
      badge: badge || ''
    };
    
    user.achievements.push(newAchievement);
    await user.save();
    
    res.json(user.achievements);
  } catch (err) {
    res.status(500).json({ message: 'Server Error', error: err.message });
  }
};

module.exports = { 
  getUsersByRole,
  getUserProfile,
  updateUserProfile,
  addAchievement
};