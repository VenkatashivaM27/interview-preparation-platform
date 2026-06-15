import api, { getData } from './api';

export const userService = {
  getProfile: () => api.get('/api/users/me').then(getData),
  getDashboard: () => api.get('/api/users/dashboard').then(getData),
  updateProfile: (data) => api.put('/api/users/me', data).then(getData),
  changePassword: (data) => api.post('/api/users/me/password', data),
  uploadAvatar: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/users/me/avatar', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(getData);
  },
  searchUsers: (q) => api.get('/api/users/search', { params: { q } }).then(getData),
};
