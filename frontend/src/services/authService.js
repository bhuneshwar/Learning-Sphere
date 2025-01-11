import axios from 'axios';

const API_URL = 'http://localhost:5000/api/auth';

export const loginUser = (credentials) => axios.post(`${API_URL}/login`, credentials);
export const registerUser = (data) => axios.post(`${API_URL}/register`, data);
