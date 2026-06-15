import api, { getData } from './api';

export const notificationService = {
  getAll: () => api.get('/api/notifications').then(getData),
  getUnreadCount: () => api.get('/api/notifications/unread-count').then(getData),
  markRead: (id) => api.patch(`/api/notifications/${id}/read`),
  markAllRead: () => api.post('/api/notifications/read-all'),
};
