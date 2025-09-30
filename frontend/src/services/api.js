import axios from 'axios';

const API_BASE = 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// API service functions
export const apiService = {
  // Auth
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),

  // Services
  getServices: (filters = {}) => api.get('/services', { params: filters }),
  getService: (id) => api.get(`/services/${id}`),
  createService: (serviceData) => api.post('/services', serviceData),
  getProviderServices: (providerId) => api.get(`/services/provider/${providerId}`),
  getMyServices: (userId) => api.get(`/me/services?user_id=${userId}`),
  searchServices: (searchParams) => api.get('/services/search', { params: searchParams }),

  // Bookings
  createBooking: (bookingData) => api.post('/bookings', bookingData),
  getUserBookings: (userId) => api.get(`/bookings/user/${userId}`),
  updateBookingStatus: (bookingId, status) => 
    api.put(`/bookings/${bookingId}/status`, { status }),

  // Reviews
  createReview: (reviewData) => api.post('/reviews', reviewData),
  getServiceReviews: (serviceId) => api.get(`/reviews/service/${serviceId}`),
  getProviderReviews: (providerId) => api.get(`/reviews/provider/${providerId}`),

  // Categories & Search
  getCategories: () => api.get('/categories'),
};

export default api;