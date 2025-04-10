const ResourceDownload = require('../models/ResourceDownload');
const Course = require('../models/Course');
const mongoose = require('mongoose');

// Record a resource download
const recordResourceDownload = async (req, res) => {
  try {
    const { courseId, resourceId, resourceType, sectionId, lessonId } = req.body;
    const userId = req.user.id;
    
    // Find the course to verify it exists and get resource details
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Find the resource based on resourceType
    let resourceData = null;
    
    if (resourceType === 'course') {
      // Find course-level resource
      resourceData = course.courseResources.id(resourceId);
      if (!resourceData) {
        return res.status(404).json({ message: 'Resource not found' });
      }
    } else if (resourceType === 'lesson') {
      // Find lesson-level resource
      if (!sectionId || !lessonId) {
        return res.status(400).json({ message: 'Section ID and Lesson ID are required for lesson resources' });
      }
      
      const section = course.sections.id(sectionId);
      if (!section) {
        return res.status(404).json({ message: 'Section not found' });
      }
      
      const lesson = section.lessons.id(lessonId);
      if (!lesson) {
        return res.status(404).json({ message: 'Lesson not found' });
      }
      
      resourceData = lesson.resources.id(resourceId);
      if (!resourceData) {
        return res.status(404).json({ message: 'Resource not found' });
      }
    } else {
      return res.status(400).json({ message: 'Invalid resource type' });
    }
    
    // Create a new download record
    const downloadRecord = new ResourceDownload({
      user: userId,
      resource: {
        resourceId: resourceId,
        title: resourceData.title,
        type: resourceData.type
      },
      course: courseId,
      section: sectionId || null,
      lesson: lessonId || null,
      resourceType,
      ipAddress: req.ip || '',
      userAgent: req.headers['user-agent'] || ''
    });
    
    await downloadRecord.save();
    
    res.status(201).json({
      message: 'Resource download recorded successfully',
      downloadId: downloadRecord._id
    });
  } catch (err) {
    console.error('Error recording resource download:', err);
    res.status(500).json({ message: 'Error recording download', error: err.message });
  }
};

// Get download statistics for a course (for instructors)
const getCourseDownloadStats = async (req, res) => {
  try {
    const { courseId } = req.params;
    
    // Verify the course exists
    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ message: 'Course not found' });
    }
    
    // Check if user is the instructor of the course or an admin
    if (course.instructor.toString() !== req.user.id && req.user.role !== 'Admin') {
      return res.status(403).json({ message: 'Not authorized to view download statistics' });
    }
    
    // Get total downloads count
    const totalDownloads = await ResourceDownload.countDocuments({ course: courseId });
    
    // Get downloads by resource type
    const downloadsByType = await ResourceDownload.aggregate([
      { $match: { course: mongoose.Types.ObjectId(courseId) } },
      { $group: { _id: '$resourceType', count: { $sum: 1 } } }
    ]);
    
    // Get most downloaded resources
    const mostDownloadedResources = await ResourceDownload.aggregate([
      { $match: { course: mongoose.Types.ObjectId(courseId) } },
      { $group: { 
          _id: '$resource.resourceId', 
          title: { $first: '$resource.title' },
          type: { $first: '$resource.type' },
          resourceType: { $first: '$resourceType' },
          count: { $sum: 1 } 
        } 
      },
      { $sort: { count: -1 } },
      { $limit: 10 }
    ]);
    
    // Get download trends (by day for the last 30 days)
    const thirtyDaysAgo = new Date();
    thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
    
    const downloadTrends = await ResourceDownload.aggregate([
      { 
        $match: { 
          course: mongoose.Types.ObjectId(courseId),
          downloadedAt: { $gte: thirtyDaysAgo } 
        } 
      },
      {
        $group: {
          _id: { $dateToString: { format: '%Y-%m-%d', date: '$downloadedAt' } },
          count: { $sum: 1 }
        }
      },
      { $sort: { _id: 1 } }
    ]);
    
    res.status(200).json({
      totalDownloads,
      downloadsByType,
      mostDownloadedResources,
      downloadTrends
    });
  } catch (err) {
    console.error('Error fetching download statistics:', err);
    res.status(500).json({ message: 'Error fetching statistics', error: err.message });
  }
};

// Get user's download history
const getUserDownloadHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10, page = 1 } = req.query;
    
    const skip = (parseInt(page) - 1) * parseInt(limit);
    
    // Get user's download history with pagination
    const downloads = await ResourceDownload.find({ user: userId })
      .sort({ downloadedAt: -1 })
      .skip(skip)
      .limit(parseInt(limit));
    
    // Get total count for pagination
    const totalCount = await ResourceDownload.countDocuments({ user: userId });
    
    res.status(200).json({
      downloads,
      pagination: {
        totalCount,
        totalPages: Math.ceil(totalCount / parseInt(limit)),
        currentPage: parseInt(page),
        limit: parseInt(limit)
      }
    });
  } catch (err) {
    console.error('Error fetching user download history:', err);
    res.status(500).json({ message: 'Error fetching download history', error: err.message });
  }
};

module.exports = {
  recordResourceDownload,
  getCourseDownloadStats,
  getUserDownloadHistory
};