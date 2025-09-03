import api from './apiConfig';

// Dashboard service for fetching real data instead of mock data
const dashboardService = {
  // Get instructor dashboard data
  getInstructorDashboard: async () => {
    try {
      const response = await api.get('/instructor/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor dashboard:', error);
      throw error;
    }
  },

  // Get learner dashboard data
  getLearnerDashboard: async () => {
    try {
      const response = await api.get('/learner/dashboard');
      return response.data;
    } catch (error) {
      console.error('Error fetching learner dashboard:', error);
      throw error;
    }
  },

  // Get instructor's courses
  getInstructorCourses: async () => {
    try {
      const response = await api.get('/courses', {
        params: {
          instructor: 'current', // Backend should handle this
          published: 'all'
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching instructor courses:', error);
      throw error;
    }
  },

  // Get learner's enrolled courses
  getLearnerCourses: async () => {
    try {
      const response = await api.get('/learner/enrolled-courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching learner courses:', error);
      throw error;
    }
  },

  // Get course analytics
  getCourseAnalytics: async (courseId) => {
    try {
      const response = await api.get(`/courses/${courseId}/analytics`);
      return response.data;
    } catch (error) {
      console.error('Error fetching course analytics:', error);
      throw error;
    }
  },

  // Get student feedback for instructor
  getStudentFeedback: async () => {
    try {
      const response = await api.get('/instructor/feedback');
      return response.data;
    } catch (error) {
      console.error('Error fetching student feedback:', error);
      throw error;
    }
  },

  // Get recommended courses for learner
  getRecommendedCourses: async () => {
    try {
      const response = await api.get('/learner/recommended-courses');
      return response.data;
    } catch (error) {
      console.error('Error fetching recommended courses:', error);
      throw error;
    }
  },

  // Get user achievements
  getUserAchievements: async () => {
    try {
      const response = await api.get('/user/achievements');
      return response.data;
    } catch (error) {
      console.error('Error fetching achievements:', error);
      throw error;
    }
  },

  // Get upcoming deadlines
  getUpcomingDeadlines: async () => {
    try {
      const response = await api.get('/learner/deadlines');
      return response.data;
    } catch (error) {
      console.error('Error fetching deadlines:', error);
      throw error;
    }
  }
};

export default dashboardService;
