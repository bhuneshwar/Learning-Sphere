import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = async (credentials) => {
  const response = await axios.post(`${API_URL}/login`, credentials);
  if (response.data.token && response.data.user) {
    localStorage.setItem('token', response.data.token); // Store token
    localStorage.setItem('user', JSON.stringify(response.data.user)); // Store user info, including role
  }
  return response.data;
};

export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
