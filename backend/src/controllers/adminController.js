const User = require('../models/userModel');
const Course = require('../models/courseModel');
const ResourceDownload = require('../models/ResourceDownload');

// Get admin dashboard overview statistics
const getDashboardStats = async (req, res) => {
  try {
    // Get total counts
    const totalUsers = await User.countDocuments();
    const totalCourses = await Course.countDocuments();
    const totalInstructors = await User.countDocuments({ role: 'Instructor' });
    const totalLearners = await User.countDocuments({ role: 'Learner' });
    
    // Get pending course approvals (courses that are not published)
    const pendingApprovals = await Course.countDocuments({ isPublished: false });
    
    // Get recent registrations (last 7 days)
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
    const recentRegistrations = await User.countDocuments({ 
      dateJoined: { $gte: sevenDaysAgo } 
    });

    // Calculate total revenue (sum of all course prices * enrolled students)
    const revenueAggregation = await Course.aggregate([
      { $match: { isPublished: true, price: { $gt: 0 } } },
      {
        $project: {
          revenue: { $multiply: ['$price', { $size: '$learners' }] }
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: '$revenue' }
        }
      }
    ]);
    
    const totalRevenue = revenueAggregation.length > 0 ? revenueAggregation[0].totalRevenue : 0;

    // Get monthly growth data for charts
    const monthlyUsers = await User.aggregate([
      {
        $group: {
          _id: { 
            year: { $year: '$dateJoined' },
            month: { $month: '$dateJoined' }
          },
          count: { $sum: 1 }
        }
      },
      { $sort: { '_id.year': 1, '_id.month': 1 } },
      { $limit: 6 } // Last 6 months
    ]);

    res.json({
      stats: {
        totalUsers,
        totalCourses,
        totalInstructors,
        totalLearners,
        pendingApprovals,
        recentRegistrations,
        totalRevenue: Math.round(totalRevenue * 100) / 100
      },
      monthlyUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching dashboard stats', error: error.message });
  }
};

// ✅ Get all users (Admin Only) - Enhanced with pagination and filtering
const getAllUsers = async (req, res) => {
  try {
    const { 
      page = 1, 
      limit = 20, 
      role, 
      search, 
      status,
      sort = 'dateJoined',
      order = 'desc' 
    } = req.query;

    // Build filter object
    const filter = {};
    if (role) filter.role = role;
    if (status) filter.isActive = status === 'active';
    
    if (search) {
      filter.$or = [
        { firstName: { $regex: search, $options: 'i' } },
        { lastName: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    // Sort options
    const sortOptions = {};
    sortOptions[sort] = order === 'asc' ? 1 : -1;

    const users = await User.find(filter)
      .select('-password -resetToken -resetTokenExpiry')
      .sort(sortOptions)
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalUsers = await User.countDocuments(filter);

    res.json({
      users,
      totalPages: Math.ceil(totalUsers / parseInt(limit)),
      currentPage: parseInt(page),
      totalUsers
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching users', error: error.message });
  }
};

// Get pending course approvals
const getPendingCourses = async (req, res) => {
  try {
    const { page = 1, limit = 20 } = req.query;

    const pendingCourses = await Course.find({ isPublished: false })
      .populate('instructor', 'firstName lastName email profilePicture')
      .select('title description shortDescription category level createdAt updatedAt')
      .sort({ createdAt: -1 })
      .skip((parseInt(page) - 1) * parseInt(limit))
      .limit(parseInt(limit));

    const totalPending = await Course.countDocuments({ isPublished: false });

    res.json({
      courses: pendingCourses,
      totalPages: Math.ceil(totalPending / parseInt(limit)),
      currentPage: parseInt(page),
      totalPending
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching pending courses', error: error.message });
  }
};

// Approve a course
const approveCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    const course = await Course.findByIdAndUpdate(
      courseId,
      { isPublished: true },
      { new: true }
    ).populate('instructor', 'firstName lastName email');

    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    res.json({ 
      message: 'Course approved successfully',
      course: {
        _id: course._id,
        title: course.title,
        instructor: course.instructor,
        isPublished: course.isPublished
      }
    });
  } catch (error) {
    res.status(500).json({ message: 'Error approving course', error: error.message });
  }
};

// Reject a course
const rejectCourse = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { reason } = req.body;
    
    const course = await Course.findById(courseId).populate('instructor', 'firstName lastName email');
    
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }

    // For now, we'll just acknowledge the rejection
    // In a real app, you might want to mark it as rejected instead of deleting
    
    res.json({ 
      message: 'Course rejected successfully',
      courseId,
      reason
    });
  } catch (error) {
    res.status(500).json({ message: 'Error rejecting course', error: error.message });
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

// Update user status (activate/deactivate)
const updateUserStatus = async (req, res) => {
  try {
    const { userId } = req.params;
    const { isActive } = req.body;
    
    const user = await User.findByIdAndUpdate(
      userId,
      { isActive },
      { new: true }
    ).select('-password -resetToken -resetTokenExpiry');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json({
      message: `User ${isActive ? 'activated' : 'deactivated'} successfully`,
      user
    });
  } catch (error) {
    res.status(500).json({ message: 'Error updating user status', error: error.message });
  }
};

// ✅ Delete user (Admin Only) - Enhanced to handle relationships
const deleteUser = async (req, res) => {
  try {
    const { id: userId } = req.params;
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // If user is an instructor, handle their courses
    if (user.role === 'Instructor') {
      const userCourses = await Course.find({ instructor: userId });
      
      // Delete the instructor's courses or reassign them
      await Course.deleteMany({ instructor: userId });
    }

    // If user is a learner, remove them from enrolled courses
    if (user.role === 'Learner') {
      await Course.updateMany(
        { learners: userId },
        { $pull: { learners: userId } }
      );
    }

    // Delete resource download records
    await ResourceDownload.deleteMany({ user: userId });

    // Finally, delete the user
    await User.findByIdAndDelete(userId);

    res.json({ message: 'User deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting user', error: error.message });
  }
};

// ✅ Get all courses (Admin Only) - Enhanced with population
const getAllCourses = async (req, res) => {
    try {
        const { page = 1, limit = 20, category, level, published } = req.query;
        
        const filter = {};
        if (category) filter.category = category;
        if (level) filter.level = level;
        if (published !== undefined) filter.isPublished = published === 'true';
        
        const courses = await Course.find(filter)
          .populate('instructor', 'firstName lastName email profilePicture')
          .sort({ createdAt: -1 })
          .skip((parseInt(page) - 1) * parseInt(limit))
          .limit(parseInt(limit));
          
        const totalCourses = await Course.countDocuments(filter);
        
        res.json({
          courses,
          totalPages: Math.ceil(totalCourses / parseInt(limit)),
          currentPage: parseInt(page),
          totalCourses
        });
    } catch (error) {
        res.status(500).json({ message: 'Error fetching courses', error: error.message });
    }
};

// ✅ Delete any course (Admin Only)
const deleteAnyCourse = async (req, res) => {
    try {
        const course = await Course.findById(req.params.id);
        if (!course) return res.status(404).json({ message: 'Course not found' });

        // Remove course from enrolled users
        await User.updateMany(
          { 'enrolledCourses.course': course._id },
          { $pull: { enrolledCourses: { course: course._id } } }
        );
        
        // Delete resource download records
        await ResourceDownload.deleteMany({ course: course._id });
        
        // Delete the course
        await Course.findByIdAndDelete(req.params.id);
        
        res.json({ message: 'Course deleted by Admin' });
    } catch (error) {
        res.status(500).json({ message: 'Error deleting course', error: error.message });
    }
};

// Get platform analytics
const getPlatformAnalytics = async (req, res) => {
  try {
    // User analytics
    const userAnalytics = await User.aggregate([
      {
        $group: {
          _id: '$role',
          count: { $sum: 1 }
        }
      }
    ]);

    // Course analytics by category
    const courseAnalytics = await Course.aggregate([
      { $match: { isPublished: true } },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          totalEnrollments: { $sum: { $size: '$learners' } },
          averageRating: { $avg: '$ratings.average' }
        }
      }
    ]);

    // Top performing courses
    const topCourses = await Course.find({ isPublished: true })
      .sort({ 'ratings.average': -1 })
      .limit(10)
      .select('title ratings totalLessons learners')
      .populate('instructor', 'firstName lastName');

    res.json({
      userAnalytics,
      courseAnalytics,
      topCourses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching analytics', error: error.message });
  }
};

// Get recent activities
const getRecentActivities = async (req, res) => {
  try {
    // Recent user registrations
    const recentUsers = await User.find()
      .sort({ dateJoined: -1 })
      .limit(10)
      .select('firstName lastName email role dateJoined profilePicture isActive');

    // Recent course creations
    const recentCourses = await Course.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('title instructor createdAt isPublished category')
      .populate('instructor', 'firstName lastName');

    res.json({
      recentUsers,
      recentCourses
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching recent activities', error: error.message });
  }
};

module.exports = { 
  getDashboardStats,
  getAllUsers, 
  updateUserRole, 
  updateUserStatus,
  deleteUser, 
  getAllCourses, 
  deleteAnyCourse,
  getPendingCourses,
  approveCourse,
  rejectCourse,
  getPlatformAnalytics,
  getRecentActivities
};
