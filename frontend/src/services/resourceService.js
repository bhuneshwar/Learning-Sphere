import api from './apiConfig';

// Search resources across courses
export const searchResources = async (searchParams) => {
  try {
    const { query, tags, type } = searchParams;
    let url = '/resources/search?';
    
    // Add query parameters if they exist
    if (query) url += `query=${encodeURIComponent(query)}&`;
    if (tags) url += `tags=${encodeURIComponent(tags)}&`;
    if (type) url += `type=${encodeURIComponent(type)}`;
    
    const response = await api.get(url);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error searching resources' };
  }
};

// Get all resources for a specific course
export const getCourseResources = async (courseId) => {
  try {
    const response = await api.get(`/resources/courses/${courseId}/resources`);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching resources' };
  }
};

// Add a resource to a course
export const addCourseResource = async (courseId, resourceData) => {
  try {
    const response = await api.post(`/resources/courses/${courseId}/resources`, resourceData);
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding resource' };
  }
};

// Update a course-level resource
export const updateCourseResource = async (courseId, resourceId, resourceData) => {
  try {
    const response = await api.put(
      `/resources/courses/${courseId}/resources/${resourceId}`,
      resourceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating resource' };
  }
};

// Delete a course-level resource
export const deleteCourseResource = async (courseId, resourceId) => {
  try {
    const response = await api.delete(
      `/resources/courses/${courseId}/resources/${resourceId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting resource' };
  }
};

// Add a resource to a specific lesson
export const addLessonResource = async (courseId, sectionId, lessonId, resourceData) => {
  try {
    const response = await api.post(
      `/resources/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources`,
      resourceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error adding resource' };
  }
};

// Update a lesson-level resource
export const updateResource = async (courseId, sectionId, lessonId, resourceId, resourceData) => {
  try {
    const response = await api.put(
      `/resources/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`,
      resourceData
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error updating resource' };
  }
};

// Delete a lesson-level resource
export const deleteResource = async (courseId, sectionId, lessonId, resourceId) => {
  try {
    const response = await api.delete(
      `/resources/courses/${courseId}/sections/${sectionId}/lessons/${lessonId}/resources/${resourceId}`
    );
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting resource' };
  }
};