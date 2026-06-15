import api, { getData } from './api';

export const analyticsService = {
  getAnalytics: () => api.get('/api/analytics').then(getData),
};
