const Course = require('../models/courseModel');
// Create a course
const createCourse = async (req, res) => {
    try {
      const { title, description } = req.body;
  
      // Use the instructor's ID from the authenticated request
      const instructor = req.user.id;
  
      const course = await Course.create({ title, description, instructor });
      res.status(201).json(course);
    } catch (err) {
      res.status(400).json({ message: 'Error creating course', error: err.message });
    }
  };
// Enroll in a course
const enrollInCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (course.learners.includes(req.user.id)) {
            return res.status(400).json({ message: 'Already enrolled' });
        }
        course.learners.push(req.user.id);
        await course.save();
        res.status(200).json({ message: 'Enrolled successfully', course });
    } catch (err) {
        res.status(400).json({
            message: 'Error enrolling in course', error:
                err.message
        });
    }
};
// Get all courses
const getCourses = async (req, res) => {
    try {
        const { page = 1, limit = 10 } = req.query; // Default values
        const courses = await Course.find()
            .populate('instructor', 'username')
            .skip((page - 1) * limit)
            .limit(parseInt(limit));
        const totalCourses = await Course.countDocuments();
        res.json({
            courses,
            totalPages: Math.ceil(totalCourses / limit),
            currentPage: parseInt(page),
        });
    } catch (err) {
        res.status(500).json({ message: 'Error fetching courses', error: err.message });
    }
};

const deleteCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });
        if (course.instructor.toString() !== req.user.id)
            return res.status(403).json({
                message: 'Not authorized to delete this course'
            });
        await course.remove();
        res.json({ message: 'Course deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: 'Error deleting course', error: err.message });
    }
};

module.exports = { createCourse, enrollInCourse, getCourses, deleteCourse }