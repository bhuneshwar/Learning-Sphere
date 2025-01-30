const User = require('../models/userModel');
const Course = require('../models/courseModel');

// ✅ Get all users (Admin Only)
const getAllUsers = async (req, res) => {
    try {
        const users = await User.find().select('-password'); // Exclude passwords
        res.json(users);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching users', error: error.message });
    }
};

// ✅ Update user role (Admin Only)
const updateUserRole = async (req, res) => {
    try {
        const { role } = req.body; // Expected: { role: 'Instructor' }
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        user.role = role;
        await user.save();
        res.json({ message: 'User role updated successfully', user });
    } catch (error) {
        res.status(500).json({ message: 'Error updating user role', error: error.message });
    }
};

// ✅ Delete user (Admin Only)
const deleteUser = async (req, res) => {
    try {
        const user = await User.findByIdAndDelete(req.params.id);
        if (!user) return res.status(404).json({ message: 'User not found' });

        res.json({ message: 'User deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting user', error: error.message });
    }
};

// ✅ Get all courses (Admin Only)
const getAllCourses = async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor', 'username');
        res.json(courses);
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

// ✅ Delete any course (Admin Only)
const deleteAnyCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        await course.remove();
        res.json({ message: 'Course deleted by Admin' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
};

module.exports = { getAllUsers, updateUserRole, deleteUser, getAllCourses, deleteAnyCourse };
