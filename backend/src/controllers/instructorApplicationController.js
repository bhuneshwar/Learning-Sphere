const User = require('../models/userModel');
const mongoose = require('mongoose');

// Submit instructor application
const submitInstructorApplication = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      experience,
      expertise,
      motivation,
      sampleCourseIdea,
      qualifications,
      linkedinProfile,
      portfolioWebsite
    } = req.body;

    // Validate required fields
    if (!experience || !expertise || !motivation || !sampleCourseIdea) {
      return res.status(400).json({ 
        message: 'Experience, expertise, motivation, and sample course idea are required' 
      });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if user already has an application pending or approved
    if (user.instructorApplication.status === 'pending') {
      return res.status(400).json({ message: 'You already have a pending instructor application' });
    }

    if (user.instructorApplication.status === 'approved' || user.capabilities.canTeach) {
      return res.status(400).json({ message: 'You are already approved to teach courses' });
    }

    // Update user's instructor application
    user.instructorApplication = {
      status: 'pending',
      appliedDate: new Date(),
      applicationData: {
        experience,
        expertise: Array.isArray(expertise) ? expertise : [expertise],
        motivation,
        sampleCourseIdea,
        qualifications,
        linkedinProfile,
        portfolioWebsite
      }
    };

    await user.save();

    res.status(200).json({
      message: 'Instructor application submitted successfully',
      application: {
        status: user.instructorApplication.status,
        appliedDate: user.instructorApplication.appliedDate
      }
    });
  } catch (error) {
    console.error('Error submitting instructor application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get instructor application status
const getInstructorApplicationStatus = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId).select('instructorApplication capabilities');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.status(200).json({
      application: user.instructorApplication,
      capabilities: user.capabilities
    });
  } catch (error) {
    console.error('Error fetching instructor application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get all pending instructor applications (Admin only)
const getPendingApplications = async (req, res) => {
  try {
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;

    const pendingApplications = await User.find({
      'instructorApplication.status': 'pending'
    })
    .select('firstName lastName email instructorApplication profilePicture dateJoined')
    .sort({ 'instructorApplication.appliedDate': -1 })
    .skip(skip)
    .limit(parseInt(limit));

    const total = await User.countDocuments({
      'instructorApplication.status': 'pending'
    });

    res.status(200).json({
      applications: pendingApplications,
      currentPage: parseInt(page),
      totalPages: Math.ceil(total / limit),
      total
    });
  } catch (error) {
    console.error('Error fetching pending applications:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Approve instructor application (Admin only)
const approveInstructorApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const adminId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.instructorApplication.status !== 'pending') {
      return res.status(400).json({ message: 'No pending application found for this user' });
    }

    // Update user to approved instructor
    user.instructorApplication.status = 'approved';
    user.instructorApplication.approvedDate = new Date();
    user.instructorApplication.reviewedBy = adminId;
    user.capabilities.canTeach = true;
    user.role = 'Instructor'; // Update primary role

    await user.save();

    res.status(200).json({
      message: 'Instructor application approved successfully',
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.instructorApplication.status
      }
    });
  } catch (error) {
    console.error('Error approving instructor application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Reject instructor application (Admin only)
const rejectInstructorApplication = async (req, res) => {
  try {
    const { userId } = req.params;
    const { reason } = req.body;
    const adminId = req.user.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ message: 'Invalid user ID' });
    }

    if (!reason) {
      return res.status(400).json({ message: 'Rejection reason is required' });
    }

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    if (user.instructorApplication.status !== 'pending') {
      return res.status(400).json({ message: 'No pending application found for this user' });
    }

    // Update user application to rejected
    user.instructorApplication.status = 'rejected';
    user.instructorApplication.rejectedDate = new Date();
    user.instructorApplication.rejectionReason = reason;
    user.instructorApplication.reviewedBy = adminId;

    await user.save();

    res.status(200).json({
      message: 'Instructor application rejected',
      user: {
        id: user._id,
        name: `${user.firstName} ${user.lastName}`,
        email: user.email,
        status: user.instructorApplication.status,
        rejectionReason: reason
      }
    });
  } catch (error) {
    console.error('Error rejecting instructor application:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

// Get application statistics (Admin only)
const getApplicationStats = async (req, res) => {
  try {
    const stats = await User.aggregate([
      {
        $group: {
          _id: '$instructorApplication.status',
          count: { $sum: 1 }
        }
      }
    ]);

    const formattedStats = {
      pending: 0,
      approved: 0,
      rejected: 0,
      none: 0
    };

    stats.forEach(stat => {
      formattedStats[stat._id] = stat.count;
    });

    // Get recent applications (last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

    const recentApplications = await User.countDocuments({
      'instructorApplication.appliedDate': { $gte: thirtyDaysAgo }
    });

    res.status(200).json({
      stats: formattedStats,
      recentApplications,
      totalInstructors: formattedStats.approved
    });
  } catch (error) {
    console.error('Error fetching application stats:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  submitInstructorApplication,
  getInstructorApplicationStatus,
  getPendingApplications,
  approveInstructorApplication,
  rejectInstructorApplication,
  getApplicationStats
};
