import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000';

if (!API_BASE_URL) {
  console.error('API_BASE_URL is not defined. Please set VITE_SERVER_URL in your .env file.');
}

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
    console.log(`Making ${config.method?.toUpperCase()} request to: ${config.url}`);
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    console.error('API Error:', error.response?.data || error.message);
    return Promise.reject(error);
  }
);

export const locationAPI = {
  saveLocation: (lat, lon) => api.post('/v1/location-stat', { lat, lon }),
};

export const newsletterAPI = {
  subscribe: (email, consent) => api.post('/v1/newsletter/subscribe', { email, consent }),
  unsubscribe: (email) => api.post('/v1/newsletter/unsubscribe', { email }),
};

export const ipLocationAPI = {
  getLocation: () => axios.get('https://ipapi.co/json/'),
};

export default api;