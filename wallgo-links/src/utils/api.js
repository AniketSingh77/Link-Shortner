import axios from 'axios';

const getBaseURL = () => {
    const envURL = import.meta.env.VITE_API_URL || import.meta.env.NEXT_PUBLIC_API_URL;
    if (envURL) {
        // Ensure /api is at the end if not provided
        return envURL.endsWith('/api') ? envURL : `${envURL}/api`;
    }
    return `${window.location.origin}/api`;
};

const api = axios.create({
  baseURL: getBaseURL()
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers['x-auth-token'] = token;
  }
  return config;
});

export default api;
