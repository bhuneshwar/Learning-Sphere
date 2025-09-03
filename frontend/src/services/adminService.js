import api from './apiConfig';

const adminService = {
  // Dashboard Stats
  getDashboardStats: async () => {
    try {
      const response = await api.get('/admin/dashboard/stats');
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      throw error;
    }
  },

  getRecentActivities: async () => {
    try {
      const response = await api.get('/admin/dashboard/activities');
      return response.data;
    } catch (error) {
      console.error('Error fetching recent activities:', error);
      throw error;
    }
  },

  // User Management
  getAllUsers: async (params = {}) => {
    try {
      const response = await api.get('/admin/users', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching users:', error);
      throw error;
    }
  },

  updateUserRole: async (userId, role) => {
    try {
      const response = await api.put(`/admin/users/${userId}/role`, { role });
      return response.data;
    } catch (error) {
      console.error('Error updating user role:', error);
      throw error;
    }
  },

  updateUserStatus: async (userId, isActive) => {
    try {
      const response = await api.put(`/admin/users/${userId}/status`, { isActive });
      return response.data;
    } catch (error) {
      console.error('Error updating user status:', error);
      throw error;
    }
  },

  deleteUser: async (userId) => {
    try {
      const response = await api.delete(`/admin/users/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting user:', error);
      throw error;
    }
  },

  // Course Management
  getAllCourses: async (params = {}) => {
    try {
      const response = await api.get('/admin/courses', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching courses:', error);
      throw error;
    }
  },

  getPendingCourses: async (params = {}) => {
    try {
      const response = await api.get('/admin/courses/pending', { params });
      return response.data;
    } catch (error) {
      console.error('Error fetching pending courses:', error);
      throw error;
    }
  },

  approveCourse: async (courseId) => {
    try {
      const response = await api.put(`/admin/courses/${courseId}/approve`);
      return response.data;
    } catch (error) {
      console.error('Error approving course:', error);
      throw error;
    }
  },

  rejectCourse: async (courseId, reason) => {
    try {
      const response = await api.put(`/admin/courses/${courseId}/reject`, { reason });
      return response.data;
    } catch (error) {
      console.error('Error rejecting course:', error);
      throw error;
    }
  },

  deleteCourse: async (courseId) => {
    try {
      const response = await api.delete(`/admin/courses/${courseId}`);
      return response.data;
    } catch (error) {
      console.error('Error deleting course:', error);
      throw error;
    }
  },

  // Analytics
  getPlatformAnalytics: async () => {
    try {
      const response = await api.get('/admin/analytics');
      return response.data;
    } catch (error) {
      console.error('Error fetching analytics:', error);
      throw error;
    }
  }
};

export default adminService;
