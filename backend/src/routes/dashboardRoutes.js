const express = require('express');
const authMiddleware = require('../middlewares/authMiddleware');
const Course = require('../models/courseModel');
const User = require('../models/userModel');

// Helper function to calculate learning streak
const calculateLearningStreak = (enrolledCourses) => {
  if (!enrolledCourses.length) return 0;
  
  // Sort courses by last accessed date
  const sortedCourses = enrolledCourses
    .filter(course => course.lastAccessed)
    .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed));
  
  if (!sortedCourses.length) return 0;
  
  let streak = 1;
  let currentDate = new Date(sortedCourses[0].lastAccessed);
  
  for (let i = 1; i < sortedCourses.length; i++) {
    const courseDate = new Date(sortedCourses[i].lastAccessed);
    const diffDays = Math.floor((currentDate - courseDate) / (1000 * 60 * 60 * 24));
    
    if (diffDays <= 1) {
      streak++;
      currentDate = courseDate;
    } else {
      break;
    }
  }
  
  return Math.min(streak, 30); // Cap at 30 days for display
};

const router = express.Router();

// Get learner dashboard data
router.get('/learner/dashboard', authMiddleware, async (req, res) => {
  try {
    const userId = req.user.id;
    
    // Get user with enrolled courses
    const user = await User.findById(userId)
      .populate('enrolledCourses.course', 'title description coverImage instructor progress')
      .populate('enrolledCourses.course.instructor', 'firstName lastName');
    
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    // Get course statistics
    const totalEnrolledCourses = user.enrolledCourses.length;
    const completedCourses = user.enrolledCourses.filter(course => course.completed).length;
    const inProgressCourses = totalEnrolledCourses - completedCourses;
    
    // Calculate average progress
    const averageProgress = totalEnrolledCourses > 0 
      ? Math.round(user.enrolledCourses.reduce((sum, course) => sum + (course.progress || 0), 0) / totalEnrolledCourses)
      : 0;

    // Calculate learning streak (days)
    const currentStreak = calculateLearningStreak(user.enrolledCourses);
    
    // Calculate total hours studied (estimate)
    const totalHoursStudied = Math.round(totalEnrolledCourses * averageProgress * 0.5 / 100); // Rough estimate
    
    // Count certificates earned (completed courses)
    const certificatesEarned = completedCourses;
    
    // Calculate points/achievements
    const totalPoints = (completedCourses * 100) + (inProgressCourses * 25);

    // Get recent courses (last accessed)
    const recentCourses = user.enrolledCourses
      .sort((a, b) => new Date(b.lastAccessed) - new Date(a.lastAccessed))
      .slice(0, 5);

    res.json({
      success: true,
      data: {
        stats: {
          totalEnrolledCourses,
          completedCourses,
          inProgressCourses,
          averageProgress,
          currentStreak,
          totalHoursStudied,
          certificatesEarned,
          totalPoints
        },
        enrolledCourses: user.enrolledCourses,
        recentCourses,
        user: {
          firstName: user.firstName,
          lastName: user.lastName,
          email: user.email,
          profilePicture: user.profilePicture
        }
      }
    });
  } catch (error) {
    console.error('Error fetching learner dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data' 
    });
  }
});

// Get instructor dashboard data
router.get('/instructor/dashboard', authMiddleware, async (req, res) => {
  try {
    const instructorId = req.user.id;
    
    // Get instructor's courses
    const courses = await Course.find({ instructor: instructorId })
      .populate('reviews.user', 'firstName lastName')
      .sort({ createdAt: -1 });
    
    if (!courses) {
      return res.status(404).json({ success: false, message: 'No courses found' });
    }

    // Calculate statistics
    const totalCourses = courses.length;
    const publishedCourses = courses.filter(course => course.isPublished).length;
    const totalStudents = courses.reduce((sum, course) => sum + course.learners.length, 0);
    const totalRevenue = courses.reduce((sum, course) => sum + (course.price * course.learners.length), 0);
    
    // Calculate average rating
    const allReviews = courses.reduce((reviews, course) => [...reviews, ...course.reviews], []);
    const averageRating = allReviews.length > 0 
      ? Math.round((allReviews.reduce((sum, review) => sum + review.rating, 0) / allReviews.length) * 10) / 10
      : 0;

    // Get recent enrollments (simplified)
    const recentEnrollments = courses
      .filter(course => course.learners.length > 0)
      .slice(0, 5)
      .map(course => ({
        courseTitle: course.title,
        studentsCount: course.learners.length,
        lastEnrollment: course.updatedAt
      }));

    res.json({
      success: true,
      data: {
        stats: {
          totalCourses,
          publishedCourses,
          totalStudents,
          totalRevenue,
          averageRating
        },
        courses: courses.map(course => ({
          _id: course._id,
          title: course.title,
          description: course.description,
          coverImage: course.coverImage,
          isPublished: course.isPublished,
          studentsEnrolled: course.learners.length,
          price: course.price,
          rating: course.ratings?.average || 0,
          createdAt: course.createdAt
        })),
        recentEnrollments,
        instructor: {
          firstName: req.user.firstName,
          lastName: req.user.lastName,
          email: req.user.email,
          profilePicture: req.user.profilePicture
        }
      }
    });
  } catch (error) {
    console.error('Error fetching instructor dashboard:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch dashboard data' 
    });
  }
});

module.exports = router;
