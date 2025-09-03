import { createFormDataRequest, getAuthHeaders } from './apiConfig';
import axios from 'axios';

const API_BASE_URL = 'http://localhost:5000/api/media';

// Upload course video
export const uploadCourseVideo = async (videoFile, courseId, sectionId, lessonId) => {
  const formData = new FormData();
  formData.append('video', videoFile);
  formData.append('courseId', courseId);
  formData.append('sectionId', sectionId);
  formData.append('lessonId', lessonId);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/video`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
      timeout: 300000, // 5 minutes timeout for video uploads
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading video' };
  }
};

// Upload course image (cover image)
export const uploadCourseImage = async (imageFile, courseId, imageType = 'cover') => {
  const formData = new FormData();
  formData.append('image', imageFile);
  formData.append('courseId', courseId);
  formData.append('imageType', imageType);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/image`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading image' };
  }
};

// Upload course document
export const uploadCourseDocument = async (documentFile, courseId, sectionId, lessonId, documentType = 'resource') => {
  const formData = new FormData();
  formData.append('document', documentFile);
  formData.append('courseId', courseId);
  formData.append('sectionId', sectionId);
  formData.append('lessonId', lessonId);
  formData.append('documentType', documentType);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/document`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading document' };
  }
};

// Upload user profile picture
export const uploadProfilePicture = async (imageFile) => {
  const formData = new FormData();
  formData.append('profilePicture', imageFile);

  try {
    const response = await axios.post(`${API_BASE_URL}/upload/profile-picture`, formData, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error uploading profile picture' };
  }
};

// Get video streaming URLs
export const getVideoStreamingUrls = async (publicId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/video/streaming/${publicId}`, {
      headers: getAuthHeaders(),
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error fetching video streaming URLs' };
  }
};

// Delete media file
export const deleteMediaFile = async (publicId, resourceType = 'image') => {
  try {
    const response = await axios.delete(`${API_BASE_URL}/delete`, {
      headers: {
        ...getAuthHeaders(),
        'Content-Type': 'application/json',
      },
      data: {
        publicId,
        resourceType,
      },
    });
    return response.data;
  } catch (error) {
    throw error.response?.data || { message: 'Error deleting media file' };
  }
};

// Upload progress tracker (for showing upload progress in UI)
export const uploadWithProgress = async (file, uploadFunction, onProgress) => {
  const config = {
    onUploadProgress: (progressEvent) => {
      const percentCompleted = Math.round((progressEvent.loaded * 100) / progressEvent.total);
      if (onProgress) {
        onProgress(percentCompleted);
      }
    },
  };
  
  return uploadFunction(file, config);
};
