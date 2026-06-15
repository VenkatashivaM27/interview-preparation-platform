import api, { getData } from './api';

export const interviewService = {
  startMock: (level) => api.post('/api/interviews/mock/start', null, { params: { level } }).then(getData),
  completeMock: (id, score, timeTakenSeconds) =>
    api.post(`/api/interviews/mock/${id}/complete`, null, { params: { score, timeTakenSeconds } }).then(getData),
  getHistory: () => api.get('/api/interviews/mock/history').then(getData),
};
