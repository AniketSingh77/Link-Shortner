import axios from 'axios';

const getBaseURL = () => {
    // VITE_ environment variables are baked in at build time.
    const apiURL = import.meta.env.VITE_API_URL;
    
    if (apiURL && !apiURL.includes('localhost')) {
      return apiURL.endsWith('/api') ? apiURL : `${apiURL}/api`;
    }
    
    // Fallback for local development or missing env
    return `${window.location.origin}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

console.log('API Base URL:', getBaseURL());

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
