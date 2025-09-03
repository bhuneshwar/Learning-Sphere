const mongoose = require('mongoose');

// AI Chat Message Schema
const aiMessageSchema = new mongoose.Schema({
  role: {
    type: String,
    enum: ['user', 'assistant', 'system'],
    required: true
  },
  content: {
    type: String,
    required: true,
    maxlength: 4000
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  metadata: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  }
}, { _id: false });

// AI Chat Session Schema
const aiChatSessionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
    index: true
  },
  sessionId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  title: {
    type: String,
    default: 'New Chat',
    maxlength: 100
  },
  messages: [aiMessageSchema],
  context: {
    type: String,
    enum: ['course', 'general'],
    default: 'general'
  },
  isActive: {
    type: Boolean,
    default: true
  },
  totalMessages: {
    type: Number,
    default: 0
  },
  lastActivity: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Update the updatedAt field before saving
aiChatSessionSchema.pre('save', function(next) {
  this.updatedAt = Date.now();
  this.totalMessages = this.messages.length;
  
  if (this.messages.length > 0) {
    this.lastActivity = this.messages[this.messages.length - 1].timestamp;
    
    // Auto-generate title from first user message if still default
    if (this.title === 'New Chat') {
      const firstUserMessage = this.messages.find(msg => msg.role === 'user');
      if (firstUserMessage) {
        // Take first 50 characters of first user message as title
        this.title = firstUserMessage.content.substring(0, 50) + 
                    (firstUserMessage.content.length > 50 ? '...' : '');
      }
    }
  }
  
  next();
});

// AI Analytics Schema (for tracking usage and insights)
const aiAnalyticsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true
  },
  courseId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Course',
    default: null,
    index: true
  },
  totalInteractions: {
    type: Number,
    default: 0
  },
  totalSessions: {
    type: Number,
    default: 0
  },
  averageSessionLength: {
    type: Number,
    default: 0
  },
  topQuestions: [{
    question: String,
    count: Number,
    lastAsked: Date
  }],
  learningInsights: {
    strugglingTopics: [String],
    interests: [String],
    learningStyle: {
      type: String,
      enum: ['visual', 'auditory', 'kinesthetic', 'reading', 'unknown'],
      default: 'unknown'
    },
    engagementLevel: {
      type: String,
      enum: ['low', 'medium', 'high'],
      default: 'medium'
    }
  },
  lastUpdated: {
    type: Date,
    default: Date.now
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Update lastUpdated before saving
aiAnalyticsSchema.pre('save', function(next) {
  this.lastUpdated = Date.now();
  next();
});

// Indexes for better performance
aiChatSessionSchema.index({ userId: 1, courseId: 1, createdAt: -1 });
aiChatSessionSchema.index({ sessionId: 1 });
aiChatSessionSchema.index({ lastActivity: -1 });
aiAnalyticsSchema.index({ userId: 1, courseId: 1 });

// Static methods for AIChatSession
aiChatSessionSchema.statics.createNewSession = function(userId, courseId = null) {
  const sessionId = `${userId}_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  
  return this.create({
    userId,
    courseId,
    sessionId,
    context: courseId ? 'course' : 'general',
    messages: [],
    isActive: true
  });
};

aiChatSessionSchema.statics.getUserSessions = function(userId, limit = 10) {
  return this.find({ userId, isActive: true })
    .sort({ lastActivity: -1 })
    .limit(limit)
    .populate('courseId', 'title description')
    .select('sessionId title context lastActivity totalMessages createdAt courseId');
};

aiChatSessionSchema.statics.getSessionWithMessages = function(sessionId, messageLimit = 20) {
  return this.findOne({ sessionId })
    .populate('userId', 'firstName lastName')
    .populate('courseId', 'title description')
    .slice('messages', -messageLimit); // Get last N messages
};

// Instance methods
aiChatSessionSchema.methods.addMessage = function(role, content, metadata = {}) {
  this.messages.push({
    role,
    content,
    metadata,
    timestamp: new Date()
  });
  
  // Keep only last 50 messages to prevent document from growing too large
  if (this.messages.length > 50) {
    this.messages = this.messages.slice(-50);
  }
  
  return this.save();
};

aiChatSessionSchema.methods.getRecentMessages = function(limit = 10) {
  return this.messages.slice(-limit);
};

// Static methods for AIAnalytics
aiAnalyticsSchema.statics.updateUserAnalytics = async function(userId, courseId, sessionData) {
  let analytics = await this.findOne({ userId, courseId });
  
  if (!analytics) {
    analytics = await this.create({
      userId,
      courseId,
      totalInteractions: 0,
      totalSessions: 0,
      topQuestions: [],
      learningInsights: {
        strugglingTopics: [],
        interests: [],
        learningStyle: 'unknown',
        engagementLevel: 'medium'
      }
    });
  }
  
  // Update statistics
  analytics.totalInteractions += sessionData.messageCount || 1;
  analytics.totalSessions += sessionData.isNewSession ? 1 : 0;
  
  // Update average session length
  if (analytics.totalSessions > 0) {
    analytics.averageSessionLength = analytics.totalInteractions / analytics.totalSessions;
  }
  
  return analytics.save();
};

// Create models
const AIChatSession = mongoose.model('AIChatSession', aiChatSessionSchema);
const AIAnalytics = mongoose.model('AIAnalytics', aiAnalyticsSchema);

module.exports = {
  AIChatSession,
  AIAnalytics
};
