import axios from 'axios';

// All API calls go through this one instance instead of importing axios directly everywhere.
// That way, the base URL and auth header logic live in exactly one place.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
});

// Interceptor runs before every single request made with this instance.
// It reads the token from localStorage and attaches it automatically —
// no controller/component needs to remember to do this manually.
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;
