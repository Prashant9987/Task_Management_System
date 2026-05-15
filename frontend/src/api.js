import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'https://taskmanagementsystem-production-0868.up.railway.app';

const api = axios.create({
  baseURL: API_URL
});

// Add token to requests
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Auth APIs
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me')
};

// Project APIs
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  addMember: (data) => api.post('/projects/members/add', data),
  removeMember: (data) => api.post('/projects/members/remove', data),
  delete: (id) => api.delete(`/projects/${id}`)
};

// Task APIs
export const taskAPI = {
  create: (data) => api.post('/tasks', data),
  getProjectTasks: (projectId) => api.get(`/tasks/project/${projectId}`),
  getAssignedTasks: () => api.get('/tasks/user/assigned'),
  updateStatus: (id, data) => api.patch(`/tasks/${id}/status`, data),
  update: (id, data) => api.patch(`/tasks/${id}`, data),
  delete: (id) => api.delete(`/tasks/${id}`),
  getDashboardStats: () => api.get('/tasks/dashboard/stats')
};

// User APIs
export const userAPI = {
  getAll: () => api.get('/users')
};

export default api;
