import api, { getData } from './api';

export const authService = {
  login: async (username, password) => {
    const res = await api.post('/api/auth/login', { username, password });
    return getData(res);
  },
  register: async (data) => {
    const res = await api.post('/api/auth/register', data);
    return getData(res);
  },
  logout: async () => {
    await api.post('/api/auth/logout');
  },
};
