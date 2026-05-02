import axios from 'axios';

// 1. Create a base Axios instance
const API = axios.create({
 baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api', // Point this to our backend
});

// 2. Add a request interceptor
API.interceptors.request.use(
  (config) => {
    // Look for the user data in local storage
    const storedUser = localStorage.getItem('user');
    
    if (storedUser) {
      const { token } = JSON.parse(storedUser);
      // If a token exists, attach it to the Authorization header
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API;