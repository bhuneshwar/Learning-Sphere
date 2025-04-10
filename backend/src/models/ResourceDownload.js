const mongoose = require('mongoose');

const resourceDownloadSchema = new mongoose.Schema({
  user: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', 
    required: true 
  },
  resource: {
    resourceId: { type: mongoose.Schema.Types.ObjectId, required: true },
    title: { type: String, required: true },
    type: { type: String, required: true }
  },
  course: { 
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'Course', 
    required: true 
  },
  section: { 
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  lesson: { 
    type: mongoose.Schema.Types.ObjectId,
    default: null
  },
  resourceType: {
    type: String,
    enum: ['course', 'lesson'],
    required: true
  },
  downloadedAt: { 
    type: Date, 
    default: Date.now 
  },
  ipAddress: { 
    type: String,
    default: ''
  },
  userAgent: { 
    type: String,
    default: ''
  }
});

// Create indexes for faster queries
resourceDownloadSchema.index({ user: 1, 'resource.resourceId': 1 });
resourceDownloadSchema.index({ course: 1 });
resourceDownloadSchema.index({ downloadedAt: 1 });

module.exports = mongoose.model('ResourceDownload', resourceDownloadSchema);