import axios from 'axios';

// baseURL is relative so it works with the proxy in both dev (Vite) and prod (Vercel)
const api = axios.create({
  baseURL: '/api'
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
