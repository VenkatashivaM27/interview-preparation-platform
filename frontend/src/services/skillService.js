import api, { getData } from './api';

export const skillService = {
  getAll: () => api.get('/api/skills').then(getData),
};

export const adminSkillService = {
  getAll: () => api.get('/api/admin/skills').then(getData),
  create: (data) => api.post('/api/admin/skills', data).then(getData),
  update: (id, data) => api.put(`/api/admin/skills/${id}`, data).then(getData),
  delete: (id) => api.delete(`/api/admin/skills/${id}`),
};
