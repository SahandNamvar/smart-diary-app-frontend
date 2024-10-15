import axios from 'axios';

// Create an Axios instance for making API requests
const api = axios.create({
  baseURL: 'http://localhost:5000/api', // Update this to your backend URL
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to include the JWT token in headers
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token'); // Get token from localStorage
  if (token) {
    config.headers['Authorization'] = `Bearer ${token}`; // Set JWT token in headers
  }
  return config;
});

export default api;

// This Axios instance will now include the JWT token in the headers automatically for all API calls.