import axios from 'axios';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 30000,
  headers: { 'Content-Type': 'application/json' },
});

// Attach token
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Handle 401
api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

// ── AUTH ──────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getProfile: () => api.get('/auth/profile'),
  updateProfile: (data) => api.put('/auth/profile', data),
  changePassword: (data) => api.put('/auth/change-password', data),
  uploadPhoto: (formData) => api.post('/auth/upload-photo', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
};

// ── INTERNSHIPS ───────────────────────────────────────────────────────────────
export const internshipAPI = {
  create: (data) => api.post('/internships', data),
  getAll: (params) => api.get('/internships', { params }),
  getMy: () => api.get('/internships/my'),
  getMentor: () => api.get('/internships/mentor'),
  getById: (id) => api.get(`/internships/${id}`),
  update: (id, data) => api.put(`/internships/${id}`, data),
  approve: (id, data) => api.patch(`/internships/${id}/approve`, data),
  updateProgress: (id, data) => api.patch(`/internships/${id}/progress`, data),
};

// ── REPORTS ───────────────────────────────────────────────────────────────────
export const reportAPI = {
  submit: (data) => api.post('/reports', data),
  getMy: (params) => api.get('/reports/my', { params }),
  getMentor: (params) => api.get('/reports/mentor', { params }),
  getById: (id) => api.get(`/reports/${id}`),
  review: (id, data) => api.patch(`/reports/${id}/review`, data),
  generateFinal: (internshipId) => api.post(`/reports/final/${internshipId}`),
};

// ── CERTIFICATES ──────────────────────────────────────────────────────────────
export const certificateAPI = {
  upload: (formData) => api.post('/certificates', formData, { headers: { 'Content-Type': 'multipart/form-data' } }),
  getMy: () => api.get('/certificates/my'),
  verify: (id, data) => api.patch(`/certificates/${id}/verify`, data),
};

// ── AI ────────────────────────────────────────────────────────────────────────
export const aiAPI = {
  chat: (messages) => api.post('/ai/chat', { messages }),
  analyzeResume: (data) => api.post('/ai/resume', data),
  mockInterview: (data) => api.post('/ai/interview', data),
  careerRoadmap: (data) => api.post('/ai/roadmap', data),
  skillGap: (data) => api.post('/ai/skill-gap', data),
};

// ── TESTS ─────────────────────────────────────────────────────────────────────
export const testAPI = {
  submit: (data) => api.post('/tests/submit', data),
  getMy: () => api.get('/tests/my'),
};

// ── NOTIFICATIONS ─────────────────────────────────────────────────────────────
export const notificationAPI = {
  getAll: (params) => api.get('/notifications', { params }),
  markAllRead: () => api.patch('/notifications/read-all'),
  sendBulk: (data) => api.post('/notifications/bulk', data),
};

// ── SKILLS ────────────────────────────────────────────────────────────────────
export const skillAPI = {
  getMy: () => api.get('/skills/my'),
  update: (data) => api.put('/skills/my', data),
  recalculate: () => api.post('/skills/recalculate'),
};

// ── STUDY ─────────────────────────────────────────────────────────────────────
export const studyAPI = {
  getAll: (params) => api.get('/study', { params }),
  create: (data) => api.post('/study', data),
};

// ── ANALYTICS ─────────────────────────────────────────────────────────────────
export const analyticsAPI = {
  admin: () => api.get('/analytics/admin'),
  student: () => api.get('/analytics/student'),
};

// ── USERS ─────────────────────────────────────────────────────────────────────
export const userAPI = {
  getAll: (params) => api.get('/users', { params }),
  getById: (id) => api.get(`/users/${id}`),
  getMentors: () => api.get('/users/mentors'),
  getMyStudents: () => api.get('/users/my-students'),
  assignMentor: (data) => api.post('/users/assign-mentor', data),
  toggleStatus: (id) => api.patch(`/users/${id}/toggle-status`),
  delete: (id) => api.delete(`/users/${id}`),
};

export default api;
