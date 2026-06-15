import api, { getData } from './api';

export const chatService = {
  send: (data) => api.post('/api/chat/send', data).then(getData),
  getPrivate: (friendId) => api.get(`/api/chat/private/${friendId}`).then(getData),
  getGroup: (groupId) => api.get(`/api/chat/group/${groupId}`).then(getData),
  getGroups: () => api.get('/api/chat/groups').then(getData),
  createGroup: (data) => api.post('/api/chat/groups', data).then(getData),
  joinGroup: (groupId) => api.post(`/api/chat/groups/${groupId}/join`).then(getData),
  report: (messageId, reason) => api.post(`/api/chat/report/${messageId}`, null, { params: { reason } }),
};
