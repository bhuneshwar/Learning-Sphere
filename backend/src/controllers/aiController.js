const aiService = require('../services/aiService');

/**
 * Create a new AI chat session
 */
const createChatSession = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.body;

    // Check if AI service is enabled
    if (!aiService.isAIEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable'
      });
    }

    const session = await aiService.createChatSession(userId, courseId);

    res.status(201).json({
      success: true,
      message: 'Chat session created successfully',
      data: session
    });
  } catch (error) {
    console.error('Error in createChatSession:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to create chat session'
    });
  }
};

/**
 * Get user's chat sessions
 */
const getUserSessions = async (req, res) => {
  try {
    const userId = req.user.id;
    const { limit = 10 } = req.query;

    const sessions = await aiService.getUserSessions(userId, parseInt(limit));

    res.json({
      success: true,
      data: sessions
    });
  } catch (error) {
    console.error('Error in getUserSessions:', error);
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch chat sessions'
    });
  }
};

/**
 * Get a specific chat session with messages
 */
const getChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { messageLimit = 20 } = req.query;

    const session = await aiService.getSession(sessionId, parseInt(messageLimit));

    // Verify user owns this session
    if (session.userId.toString() !== req.user.id) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      data: {
        sessionId: session.sessionId,
        title: session.title,
        context: session.context,
        courseId: session.courseId,
        messages: session.messages,
        totalMessages: session.totalMessages,
        lastActivity: session.lastActivity
      }
    });
  } catch (error) {
    console.error('Error in getChatSession:', error);
    
    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to fetch chat session'
    });
  }
};

/**
 * Send a message and get AI response
 */
const sendMessage = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const { message } = req.body;
    const userId = req.user.id;

    // Validate input
    if (!message || message.trim().length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Message content is required'
      });
    }

    if (message.trim().length > 2000) {
      return res.status(400).json({
        success: false,
        message: 'Message is too long. Maximum length is 2000 characters.'
      });
    }

    // Check if AI service is enabled
    if (!aiService.isAIEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable'
      });
    }

    const result = await aiService.sendMessage(sessionId, message.trim(), userId);

    res.json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Error in sendMessage:', error);
    
    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }
    
    if (error.message === 'Unauthorized access to chat session') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Handle specific AI service errors
    const errorMessage = error.message.includes('AI service') 
      ? error.message 
      : 'Failed to send message. Please try again.';
      
    res.status(500).json({
      success: false,
      message: errorMessage
    });
  }
};

/**
 * Delete a chat session
 */
const deleteChatSession = async (req, res) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user.id;

    await aiService.deleteSession(sessionId, userId);

    res.json({
      success: true,
      message: 'Chat session deleted successfully'
    });
  } catch (error) {
    console.error('Error in deleteChatSession:', error);
    
    if (error.message === 'Session not found') {
      return res.status(404).json({
        success: false,
        message: 'Chat session not found'
      });
    }
    
    if (error.message === 'Unauthorized') {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }
    
    res.status(400).json({
      success: false,
      message: error.message || 'Failed to delete chat session'
    });
  }
};

/**
 * Generate course summary using AI
 */
const generateCourseSummary = async (req, res) => {
  try {
    const { courseId } = req.params;

    // Check if AI service is enabled
    if (!aiService.isAIEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable'
      });
    }

    const summary = await aiService.generateCourseSummary(courseId);

    if (!summary) {
      return res.status(404).json({
        success: false,
        message: 'Unable to generate course summary'
      });
    }

    res.json({
      success: true,
      data: {
        courseId,
        summary,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error in generateCourseSummary:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate course summary'
    });
  }
};

/**
 * Generate suggested questions for a course
 */
const generateSuggestedQuestions = async (req, res) => {
  try {
    const { courseId } = req.params;
    const { limit = 5 } = req.query;

    // Check if AI service is enabled
    if (!aiService.isAIEnabled()) {
      return res.status(503).json({
        success: false,
        message: 'AI service is currently unavailable'
      });
    }

    const questions = await aiService.generateSuggestedQuestions(courseId, parseInt(limit));

    res.json({
      success: true,
      data: {
        courseId,
        questions,
        generatedAt: new Date()
      }
    });
  } catch (error) {
    console.error('Error in generateSuggestedQuestions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to generate suggested questions'
    });
  }
};

/**
 * Get user analytics
 */
const getUserAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;
    const { courseId } = req.query;

    const analytics = await aiService.getUserAnalytics(userId, courseId);

    res.json({
      success: true,
      data: analytics
    });
  } catch (error) {
    console.error('Error in getUserAnalytics:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch analytics'
    });
  }
};

/**
 * Get AI service status
 */
const getAIServiceStatus = async (req, res) => {
  try {
    const isEnabled = aiService.isAIEnabled();
    
    res.json({
      success: true,
      data: {
        enabled: isEnabled,
        message: isEnabled 
          ? 'AI service is operational' 
          : 'AI service is disabled - OpenAI API key not configured'
      }
    });
  } catch (error) {
    console.error('Error in getAIServiceStatus:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to check AI service status'
    });
  }
};

/**
 * Get AI service statistics (Admin only)
 */
const getServiceStats = async (req, res) => {
  try {
    // Check if user is admin
    if (req.user.role !== 'Admin') {
      return res.status(403).json({
        success: false,
        message: 'Admin access required'
      });
    }

    const stats = await aiService.getServiceStats();

    res.json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Error in getServiceStats:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch service statistics'
    });
  }
};

module.exports = {
  createChatSession,
  getUserSessions,
  getChatSession,
  sendMessage,
  deleteChatSession,
  generateCourseSummary,
  generateSuggestedQuestions,
  getUserAnalytics,
  getAIServiceStatus,
  getServiceStats
};
