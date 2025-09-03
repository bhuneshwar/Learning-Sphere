const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['Admin', 'Instructor', 'Learner'], default: 'Learner' },
  capabilities: {
    canTeach: { type: Boolean, default: false },
    canLearn: { type: Boolean, default: true },
    canAdmin: { type: Boolean, default: false }
  },
  instructorApplication: {
    status: { 
      type: String, 
      enum: ['none', 'pending', 'approved', 'rejected'], 
      default: 'none' 
    },
    appliedDate: { type: Date },
    approvedDate: { type: Date },
    rejectedDate: { type: Date },
    rejectionReason: { type: String },
    reviewedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    applicationData: {
      experience: { type: String },
      expertise: [{ type: String }],
      motivation: { type: String },
      sampleCourseIdea: { type: String },
      qualifications: { type: String },
      linkedinProfile: { type: String },
      portfolioWebsite: { type: String }
    }
  },
  profilePicture: { type: String, default: '' },
  bio: { type: String, default: '' },
  dateJoined: { type: Date, default: Date.now },
  lastLogin: { type: Date },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  resetToken: { type: String },
  resetTokenExpiry: { type: Date },
  skills: [{ type: String }],
  interests: [{ type: String }],
  socialLinks: {
    linkedin: { type: String, default: '' },
    github: { type: String, default: '' },
    twitter: { type: String, default: '' },
    website: { type: String, default: '' }
  },
  achievements: [{
    title: { type: String, required: true },
    description: { type: String },
    dateEarned: { type: Date, default: Date.now },
    badge: { type: String }
  }],
  profileCompleteness: { type: Number, default: 0 },
  enrolledCourses: [{
    course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course' },
    enrollmentDate: { type: Date, default: Date.now },
    progress: { type: Number, default: 0 },
    completed: { type: Boolean, default: false },
    lastAccessed: { type: Date },
    lessonProgress: [{
      sectionIndex: { type: Number, required: true },
      lessonIndex: { type: Number, required: true },
      completed: { type: Boolean, default: false },
      completedAt: { type: Date },
      timeSpent: { type: Number, default: 0 }, // in minutes
      lastPosition: { type: Number, default: 0 } // for video playback position
    }]
  }],
  preferences: {
    notifications: { type: Boolean, default: true },
    theme: { type: String, default: 'light' },
    language: { type: String, default: 'en' }
  }
});


// Hash the password before saving
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) return next();
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
  next();
});

module.exports = mongoose.model('User', userSchema);
