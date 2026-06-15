import api, { getData } from './api';

export const friendService = {
  getFriends: () => api.get('/api/friends').then(getData),
  sendRequest: (userId) => api.post(`/api/friends/request/${userId}`).then(getData),
  acceptRequest: (requestId) => api.post(`/api/friends/accept/${requestId}`),
  rejectRequest: (requestId) => api.post(`/api/friends/reject/${requestId}`),
};
