import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials, {
    withCredentials: true // Enable cookie sending
  });
  return response.data;
};

export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
