import api from './apiConfig';

// Record a resource download
export const recordResourceDownload = async (downloadData) => {
  try {
    const response = await api.post('/resource-downloads/record', downloadData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error recording download' };
  }
};

// Get download statistics for a course (for instructors)
export const getCourseDownloadStats = async (courseId) => {
  try {
    const response = await api.get(`/resource-downloads/courses/${courseId}/stats`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching download statistics' };
  }
};

// Get user's download history
export const getUserDownloadHistory = async (page = 1, limit = 10) => {
  try {
    const response = await api.get(`/resource-downloads/history?page=${page}&limit=${limit}`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching download history' };
  }
};