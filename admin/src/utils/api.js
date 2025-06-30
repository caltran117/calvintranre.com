import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_SERVER_URL || 'http://localhost:4000/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use(
  (config) => {
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
    if (error.response?.status === 401) {
      localStorage.removeItem('accessToken');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  signin: (credentials) => 
    api.post('/auth/signin', {
      email: credentials.email,
      password: credentials.password,
      role: 'admin'
    }),
  
  getProfile: () => 
    api.get('/auth/profile'),
};

export const healthAPI = {
  checkHealth: () => api.get('/health'),
  checkSelf: () => api.get('/self'),
  checkAuthSelf: () => api.get('/auth/self'),
  checkLocationStatSelf: () => api.get('/location-stat/self'),
  checkPropertySelf: () => api.get('/property/self'),
  checkNewsletterSelf: () => api.get('/newsletter/self'),
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
    if (params.sortBy) queryParams.append('sortBy', params.sortBy);
    if (params.sortOrder) queryParams.append('sortOrder', params.sortOrder);
    
    const queryString = queryParams.toString();
    return api.get(`/property${queryString ? `?${queryString}` : ''}`);
  },

  searchProperties: (params = {}) => {
    const queryParams = new URLSearchParams();
    
    if (params.query) queryParams.append('query', params.query);
    if (params.page) queryParams.append('page', params.page);
    if (params.limit) queryParams.append('limit', params.limit);
    if (params.lat) queryParams.append('lat', params.lat);
    if (params.lon) queryParams.append('lon', params.lon);
    if (params.radius) queryParams.append('radius', params.radius);
    
    const queryString = queryParams.toString();
    return api.get(`/property/search${queryString ? `?${queryString}` : ''}`);
  },

  getFeaturedProperties: (limit = 6) =>
    api.get(`/property/featured?limit=${limit}`),

  getPropertyById: (propertyId) =>
    api.get(`/property/${propertyId}`),

  getSimilarProperties: (propertyId, limit = 4) =>
    api.get(`/property/${propertyId}/similar?limit=${limit}`),

  addProperty: (propertyData) =>
    api.post('/property/admin/add', propertyData),

  updateProperty: (propertyId, propertyData) =>
    api.put(`/property/admin/${propertyId}`, propertyData),

  deleteProperty: (propertyId) =>
    api.delete(`/property/admin/${propertyId}`),
};

export default api;