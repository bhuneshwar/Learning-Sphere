import axios from 'axios';
import { getAuthConfig } from '../utils/authUtils';

const API_URL = process.env.REACT_APP_API_URL || '';

// Get user profile
export const getUserProfile = async (userId = null) => {
  try {
    const config = getAuthConfig();
    const endpoint = userId ? `/api/profile/${userId}` : '/api/profile';
    const response = await axios.get(`${API_URL}${endpoint}`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching user profile:', error);
    throw error;
  }
};

// Update user profile
export const updateUserProfile = async (profileData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(`${API_URL}/api/profile`, profileData, config);
    return response.data;
  } catch (error) {
    console.error('Error updating user profile:', error);
    throw error;
  }
};

// Add achievement to user profile
export const addAchievement = async (achievementData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.post(
      `${API_URL}/api/profile/achievements`,
      achievementData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding achievement:', error);
    throw error;
  }
};

// Upload profile picture
export const uploadProfilePicture = async (imageFile) => {
  try {
    const config = getAuthConfig();
    config.headers['Content-Type'] = 'multipart/form-data';
    
    const formData = new FormData();
    formData.append('profilePicture', imageFile);
    
    const response = await axios.post(
      `${API_URL}/api/profile/upload-picture`,
      formData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error uploading profile picture:', error);
    throw error;
  }
};

// Get user education history
export const getUserEducation = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/api/profile/education`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching education history:', error);
    throw error;
  }
};

// Add education entry
export const addEducation = async (educationData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.post(
      `${API_URL}/api/profile/education`,
      educationData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding education:', error);
    throw error;
  }
};

// Update education entry
export const updateEducation = async (educationId, educationData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(
      `${API_URL}/api/profile/education/${educationId}`,
      educationData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error updating education:', error);
    throw error;
  }
};

// Delete education entry
export const deleteEducation = async (educationId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.delete(
      `${API_URL}/api/profile/education/${educationId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting education:', error);
    throw error;
  }
};

// Get user work experience
export const getUserExperience = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/api/profile/experience`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching work experience:', error);
    throw error;
  }
};

// Add work experience
export const addExperience = async (experienceData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.post(
      `${API_URL}/api/profile/experience`,
      experienceData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding work experience:', error);
    throw error;
  }
};

// Update work experience
export const updateExperience = async (experienceId, experienceData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(
      `${API_URL}/api/profile/experience/${experienceId}`,
      experienceData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error updating work experience:', error);
    throw error;
  }
};

// Delete work experience
export const deleteExperience = async (experienceId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.delete(
      `${API_URL}/api/profile/experience/${experienceId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting work experience:', error);
    throw error;
  }
};

// Get user certificates
export const getUserCertificates = async () => {
  try {
    const config = getAuthConfig();
    const response = await axios.get(`${API_URL}/api/profile/certificates`, config);
    return response.data;
  } catch (error) {
    console.error('Error fetching certificates:', error);
    throw error;
  }
};

// Add certificate
export const addCertificate = async (certificateData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.post(
      `${API_URL}/api/profile/certificates`,
      certificateData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error adding certificate:', error);
    throw error;
  }
};

// Update certificate
export const updateCertificate = async (certificateId, certificateData) => {
  try {
    const config = getAuthConfig();
    const response = await axios.put(
      `${API_URL}/api/profile/certificates/${certificateId}`,
      certificateData,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error updating certificate:', error);
    throw error;
  }
};

// Delete certificate
export const deleteCertificate = async (certificateId) => {
  try {
    const config = getAuthConfig();
    const response = await axios.delete(
      `${API_URL}/api/profile/certificates/${certificateId}`,
      config
    );
    return response.data;
  } catch (error) {
    console.error('Error deleting certificate:', error);
    throw error;
  }
};