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
    
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
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


export const authAPI = {
  signin: (email, role, password) => {
    const payload = { email };
    if (role) payload.role = role;
    if (password) payload.password = password;
    return api.post('/v1/auth/signin', payload);
  },
  getProfile: () => api.get('/v1/auth/profile'),
  updateProfile: (data) => api.put('/v1/auth/profile', data),
  checkAuth: () => api.get('/v1/auth/self'),
};

export const propertyAPI = {

  getAllProperties: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    if (params.status) queryParams.append('status', params.status);
    if (params.propertyType) queryParams.append('propertyType', params.propertyType);
    if (params.beds) queryParams.append('beds', params.beds);
    if (params.city) queryParams.append('city', params.city);
    if (params.featured) queryParams.append('featured', params.featured);
    
    if (params.minPrice) queryParams.append('minPrice', params.minPrice);
    if (params.maxPrice) queryParams.append('maxPrice', params.maxPrice);
    
    if (params.minRent) queryParams.append('minRent', params.minRent);
    if (params.maxRent) queryParams.append('maxRent', params.maxRent);
    if (params.furnished) queryParams.append('furnished', params.furnished);
    if (params.petAllowed) queryParams.append('petAllowed', params.petAllowed);
    

    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    return api.get(`/v1/property${queryString ? `?${queryString}` : ''}`);
  },


  searchProperties: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    
    const queryString = queryParams.toString();
    return api.get(`/v1/property/search${queryString ? `?${queryString}` : ''}`);
  },

  searchByLocation: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.lat) queryParams.append('lat', params.lat);
    if (params.lon) queryParams.append('lon', params.lon);
    if (params.radius) queryParams.append('radius', params.radius);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.query) queryParams.append('query', params.query);
    
    const queryString = queryParams.toString();
    return api.get(`/v1/property/search${queryString ? `?${queryString}` : ''}`);
  },

  getFeaturedProperties: (limit = 6) => 
    api.get(`/v1/property/featured?limit=${limit}`),

  getPropertyById: (propertyId) => 
    api.get(`/v1/property/${propertyId}`),

  getSimilarProperties: (propertyId, limit = 4) => 
    api.get(`/v1/property/${propertyId}/similar?limit=${limit}`),
};

export default api;