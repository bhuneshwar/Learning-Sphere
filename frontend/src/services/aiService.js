import api from './apiConfig';

const aiService = {
  // Create a new chat session
  createChatSession: async (courseId = null) => {
    try {
      const response = await api.post('/ai/sessions', { courseId });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to create chat session' };
    }
  },

  // Get user's chat sessions
  getUserSessions: async (limit = 10) => {
    try {
      const response = await api.get(`/ai/sessions?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch chat sessions' };
    }
  },

  // Get a specific chat session
  getChatSession: async (sessionId, messageLimit = 20) => {
    try {
      const response = await api.get(`/ai/sessions/${sessionId}?messageLimit=${messageLimit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch chat session' };
    }
  },

  // Send a message
  sendMessage: async (sessionId, message) => {
    try {
      const response = await api.post(`/ai/sessions/${sessionId}/messages`, { message });
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to send message' };
    }
  },

  // Delete a chat session
  deleteChatSession: async (sessionId) => {
    try {
      const response = await api.delete(`/ai/sessions/${sessionId}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to delete chat session' };
    }
  },

  // Generate course summary
  generateCourseSummary: async (courseId) => {
    try {
      const response = await api.get(`/ai/courses/${courseId}/summary`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate course summary' };
    }
  },

  // Generate suggested questions
  generateSuggestedQuestions: async (courseId, limit = 5) => {
    try {
      const response = await api.get(`/ai/courses/${courseId}/questions?limit=${limit}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to generate suggested questions' };
    }
  },

  // Get user analytics
  getUserAnalytics: async (courseId = null) => {
    try {
      const response = await api.get(`/ai/analytics${courseId ? `?courseId=${courseId}` : ''}`);
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to fetch analytics' };
    }
  },

  // Get AI service status
  getAIServiceStatus: async () => {
    try {
      const response = await api.get('/ai/status');
      return response.data;
    } catch (error) {
      throw error.response?.data || { message: 'Failed to check AI service status' };
    }
  }
};

export default aiService;
