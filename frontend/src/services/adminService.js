import api, { getData } from './api';

export const adminService = {
  getDashboard: () => api.get('/api/admin/dashboard').then(getData),
  getUsers: (page = 0, size = 10, search = '') =>
    api.get('/api/admin/users', { params: { page, size, search } }).then(getData),
  toggleUserActive: (id) => api.patch(`/api/admin/users/${id}/toggle-active`).then(getData),
  deleteUser: (id) => api.delete(`/api/admin/users/${id}`),
  getProgrammingQuestions: (page = 0, size = 10) =>
    api.get('/api/admin/programming-questions', { params: { page, size } }).then(getData),
  createProgrammingQuestion: (data) => api.post('/api/admin/programming-questions', data).then(getData),
  updateProgrammingQuestion: (id, data) => api.put(`/api/admin/programming-questions/${id}`, data).then(getData),
  deleteProgrammingQuestion: (id) => api.delete(`/api/admin/programming-questions/${id}`),
  getSkills: () => api.get('/api/admin/skills').then(getData),
  createSkill: (data) => api.post('/api/admin/skills', data).then(getData),
  deleteSkill: (id) => api.delete(`/api/admin/skills/${id}`),
  createInterviewQuestion: (data) => api.post('/api/admin/interview-questions', data).then(getData),
  deleteInterviewQuestion: (id) => api.delete(`/api/admin/interview-questions/${id}`),
  getInterviewQuestions: () => api.get('/api/admin/interview-questions').then(getData),
  getReports: () => api.get('/api/admin/reports').then(getData),
  resolveReport: (id, notes) => api.patch(`/api/admin/reports/${id}/resolve`, null, { params: { notes } }),
  getGroups: () => api.get('/api/admin/groups').then(getData),
};
