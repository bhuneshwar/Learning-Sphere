const axios = require('axios');
const { OPENROUTER_CONFIG, AI_CONFIG } = require('../config/ai');
const { AIChatSession, AIAnalytics } = require('../models/aiChatModel');
const Course = require('../models/courseModel');

class AIService {
  constructor() {
    this.isEnabled = !!process.env.OPENROUTER_API_KEY;
    if (!this.isEnabled) {
      console.warn('AI Service disabled: OpenRouter API key not found');
    }
  }

  /**
   * Check if AI service is enabled
   */
  isAIEnabled() {
    return this.isEnabled;
  }

  /**
   * Create a new chat session
   */
  async createChatSession(userId, courseId = null) {
    try {
      const session = await AIChatSession.createNewSession(userId, courseId);
      
      // Add welcome message
      const welcomeMessage = courseId 
        ? "Hi! I'm your AI learning assistant for this course. I'm here to help you understand the material, answer questions, and guide your learning. What would you like to know?"
        : "Hi! I'm your AI learning assistant. I can help you with course questions, study tips, and learning guidance. How can I assist you today?";
      
      await session.addMessage('assistant', welcomeMessage);
      
      return {
        sessionId: session.sessionId,
        title: session.title,
        context: session.context,
        messages: session.messages
      };
    } catch (error) {
      console.error('Error creating chat session:', error);
      throw new Error('Failed to create chat session');
    }
  }

  /**
   * Get user's chat sessions
   */
  async getUserSessions(userId, limit = 10) {
    try {
      return await AIChatSession.getUserSessions(userId, limit);
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw new Error('Failed to fetch chat sessions');
    }
  }

  /**
   * Get a specific session with messages
   */
  async getSession(sessionId, messageLimit = 20) {
    try {
      const session = await AIChatSession.getSessionWithMessages(sessionId, messageLimit);
      if (!session) {
        throw new Error('Session not found');
      }
      return session;
    } catch (error) {
      console.error('Error fetching session:', error);
      throw error;
    }
  }

  /**
   * Send a message and get AI response
   */
  async sendMessage(sessionId, userMessage, userId) {
    if (!this.isEnabled) {
      throw new Error('AI service is not enabled');
    }

    try {
      // Get the session
      const session = await this.getSession(sessionId);
      
      // Verify user owns this session
      if (session.userId.toString() !== userId) {
        throw new Error('Unauthorized access to chat session');
      }

      // Add user message to session
      await session.addMessage('user', userMessage);

      // Get course context if this is a course-specific chat
      let courseContext = null;
      if (session.courseId) {
        courseContext = await Course.findById(session.courseId)
          .select('title description learningOutcomes prerequisites category');
      }

      // Prepare conversation history for AI
      const recentMessages = session.getRecentMessages(AI_CONFIG.maxChatHistory);
      const messages = await this.prepareMessagesForAI(recentMessages, courseContext);

      // Get AI response
      const aiResponse = await this.getAIResponse(messages);

      // Add AI response to session
      await session.addMessage('assistant', aiResponse, {
        model: AI_CONFIG.model,
        tokens: aiResponse.length // Approximate token count
      });

      // Update analytics
      await AIAnalytics.updateUserAnalytics(userId, session.courseId, {
        messageCount: 1,
        isNewSession: false
      });

      return {
        sessionId: session.sessionId,
        messages: session.getRecentMessages(5), // Return last 5 messages
        response: aiResponse
      };

    } catch (error) {
      console.error('Error in sendMessage:', error);
      throw error;
    }
  }

  /**
   * Prepare messages for OpenAI API
   */
  async prepareMessagesForAI(messages, courseContext = null) {
    const systemPrompt = courseContext 
      ? AI_CONFIG.systemPrompts.courseAssistant(courseContext)
      : AI_CONFIG.systemPrompts.generalAssistant;

    const formattedMessages = [
      { role: 'system', content: systemPrompt }
    ];

    // Add conversation history
    messages.forEach(msg => {
      if (msg.role !== 'system') {
        formattedMessages.push({
          role: msg.role,
          content: msg.content
        });
      }
    });

    return formattedMessages;
  }

  /**
   * Get response from OpenRouter
   */
  async getAIResponse(messages) {
    try {
      const response = await axios.post(
        `${OPENROUTER_CONFIG.baseURL}/chat/completions`,
        {
          model: AI_CONFIG.model,
          messages: messages,
          max_tokens: AI_CONFIG.maxTokens,
          temperature: AI_CONFIG.temperature,
          stream: false
        },
        {
          headers: {
            'Authorization': `Bearer ${OPENROUTER_CONFIG.apiKey}`,
            'Content-Type': 'application/json',
            'HTTP-Referer': 'http://localhost:5000',
            'X-Title': 'Learning Sphere AI Assistant'
          }
        }
      );

      const aiResponse = response.data.choices[0]?.message?.content;
      
      if (!aiResponse) {
        throw new Error('No response received from AI service');
      }

      return aiResponse.trim();

    } catch (error) {
      console.error('OpenRouter API Error:', error.response?.data || error.message);
      
      // Handle different types of errors
      const status = error.response?.status;
      if (status === 429) {
        throw new Error('AI service is currently busy. Please try again in a moment.');
      } else if (status === 401) {
        throw new Error('AI service configuration error');
      } else if (status >= 500) {
        throw new Error('AI service is temporarily unavailable');
      } else {
        throw new Error('Failed to get AI response');
      }
    }
  }

  /**
   * Generate course summary using AI
   */
  async generateCourseSummary(courseId) {
    if (!this.isEnabled) {
      return null;
    }

    try {
      const course = await Course.findById(courseId)
        .select('title description learningOutcomes prerequisites category sections');

      if (!course) {
        throw new Error('Course not found');
      }

      const prompt = `Create a comprehensive course summary for "${course.title}".

Course Details:
- Description: ${course.description || 'Not provided'}
- Category: ${course.category || 'Not specified'}
- Learning Objectives: ${course.learningOutcomes ? course.learningOutcomes.join(', ') : 'Not specified'}
- Prerequisites: ${course.prerequisites ? course.prerequisites.join(', ') : 'None'}
- Number of Sections: ${course.sections ? course.sections.length : 0}

Please provide:
1. A concise overview (2-3 sentences)
2. Key topics covered
3. What students will achieve
4. Who should take this course

Keep it engaging and informative.`;

      const response = await this.getAIResponse([
        { role: 'system', content: 'You are an educational content expert who creates engaging course summaries.' },
        { role: 'user', content: prompt }
      ]);

      return response;

    } catch (error) {
      console.error('Error generating course summary:', error);
      return null;
    }
  }

  /**
   * Generate suggested questions for a course
   */
  async generateSuggestedQuestions(courseId, limit = 5) {
    if (!this.isEnabled) {
      return [];
    }

    try {
      const course = await Course.findById(courseId)
        .select('title description category learningOutcomes');

      if (!course) {
        return [];
      }

      const prompt = `Generate ${limit} helpful questions that students commonly ask about "${course.title}".

Course Context:
- Category: ${course.category}
- Description: ${course.description}
- Learning Objectives: ${course.learningOutcomes ? course.learningOutcomes.join(', ') : 'Not specified'}

Generate questions that are:
- Specific to the course content
- Helpful for learning
- Commonly asked by students
- Varied in difficulty

Format as a simple list, one question per line.`;

      const response = await this.getAIResponse([
        { role: 'system', content: 'You are an educational expert who understands what students commonly ask about courses.' },
        { role: 'user', content: prompt }
      ]);

      // Parse the response into an array of questions
      return response
        .split('\n')
        .filter(line => line.trim().length > 0)
        .map(line => line.replace(/^\d+\.\s*/, '').trim()) // Remove numbering
        .slice(0, limit);

    } catch (error) {
      console.error('Error generating suggested questions:', error);
      return [];
    }
  }

  /**
   * Get user analytics
   */
  async getUserAnalytics(userId, courseId = null) {
    try {
      return await AIAnalytics.findOne({ userId, courseId });
    } catch (error) {
      console.error('Error fetching user analytics:', error);
      return null;
    }
  }

  /**
   * Delete a chat session
   */
  async deleteSession(sessionId, userId) {
    try {
      const session = await AIChatSession.findOne({ sessionId });
      
      if (!session) {
        throw new Error('Session not found');
      }

      if (session.userId.toString() !== userId) {
        throw new Error('Unauthorized');
      }

      session.isActive = false;
      await session.save();

      return true;
    } catch (error) {
      console.error('Error deleting session:', error);
      throw error;
    }
  }

  /**
   * Get AI service statistics (for admin)
   */
  async getServiceStats() {
    try {
      const totalSessions = await AIChatSession.countDocuments({ isActive: true });
      const totalMessages = await AIChatSession.aggregate([
        { $match: { isActive: true } },
        { $group: { _id: null, total: { $sum: '$totalMessages' } } }
      ]);

      const activeUsersToday = await AIChatSession.distinct('userId', {
        lastActivity: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) }
      });

      return {
        totalSessions,
        totalMessages: totalMessages[0]?.total || 0,
        activeUsersToday: activeUsersToday.length,
        isEnabled: this.isEnabled
      };
    } catch (error) {
      console.error('Error getting service stats:', error);
      return {
        totalSessions: 0,
        totalMessages: 0,
        activeUsersToday: 0,
        isEnabled: this.isEnabled
      };
    }
  }
}

// Export singleton instance
module.exports = new AIService();
