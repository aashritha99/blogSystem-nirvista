import axios from 'axios';
import store from '../store';
import { logout } from '../store/slices/authSlice';
import toast from 'react-hot-toast';

const API_BASE_URL = 'http://127.0.0.1:8000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.token;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh and errors
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const state = store.getState();
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/users/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const newToken = response.data.access;
          localStorage.setItem('token', newToken);
          
          // Update the authorization header
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          
          return api(originalRequest);
        } catch (refreshError) {
          // Refresh token is invalid, logout user
          store.dispatch(logout());
          toast.error('Session expired. Please login again.');
          window.location.href = '/login';
          return Promise.reject(refreshError);
        }
      } else {
        // No refresh token, logout user
        store.dispatch(logout());
        toast.error('Session expired. Please login again.');
        window.location.href = '/login';
      }
    }
    
    // Handle other errors
    if (error.response?.status === 403) {
      toast.error('You do not have permission to perform this action.');
    } else if (error.response?.status === 404) {
      toast.error('Resource not found.');
    } else if (error.response?.status >= 500) {
      toast.error('Server error. Please try again later.');
    } else if (error.response?.data?.message) {
      toast.error(error.response.data.message);
    } else if (error.message) {
      toast.error(error.message);
    }
    
    return Promise.reject(error);
  }
);

// API endpoints
export const authAPI = {
  login: (credentials) => api.post('/users/login/', credentials),
  register: (userData) => api.post('/users/register/', userData),
  logout: () => api.post('/users/logout/'),
  getProfile: () => api.get('/users/profile/'),
  updateProfile: (userData) => api.put('/users/profile/', userData),
  changePassword: (passwordData) => api.post('/users/change-password/', passwordData),
  refreshToken: (refreshToken) => api.post('/users/token/refresh/', { refresh: refreshToken }),
};

export const blogAPI = {
  getBlogs: (params) => api.get('/blogs/', { params }),
  getBlog: (id) => api.get(`/blogs/${id}/`),
  createBlog: (blogData) => api.post('/blogs/', blogData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  updateBlog: (id, blogData) => api.put(`/blogs/${id}/`, blogData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  deleteBlog: (id) => api.delete(`/blogs/${id}/`),
  uploadImage: (imageData) => api.post('/blogs/upload-image/', imageData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
};

export const categoryAPI = {
  getCategories: () => api.get('/categories/'),
  getCategory: (id) => api.get(`/categories/${id}/`),
  createCategory: (categoryData) => api.post('/categories/', categoryData),
  updateCategory: (id, categoryData) => api.put(`/categories/${id}/`, categoryData),
  deleteCategory: (id) => api.delete(`/categories/${id}/`),
};

export const tagAPI = {
  getTags: () => api.get('/tags/'),
  getTag: (id) => api.get(`/tags/${id}/`),
  createTag: (tagData) => api.post('/tags/', tagData),
  updateTag: (id, tagData) => api.put(`/tags/${id}/`, tagData),
  deleteTag: (id) => api.delete(`/tags/${id}/`),
};

export const commentAPI = {
  getComments: (blogId) => api.get('/comments/', { params: { blog: blogId } }),
  createComment: (commentData) => api.post('/comments/', commentData),
  updateComment: (id, commentData) => api.put(`/comments/${id}/`, commentData),
  deleteComment: (id) => api.delete(`/comments/${id}/`),
  approveComment: (id) => api.patch(`/comments/${id}/`, { is_approved: true }),
  getPendingComments: () => api.get('/comments/', { params: { is_approved: false } }),
};

export const newsletterAPI = {
  subscribe: (email) => api.post('/newsletter/subscribe/', { email }),
  unsubscribe: (email) => api.post('/newsletter/unsubscribe/', { email }),
};

export default api;