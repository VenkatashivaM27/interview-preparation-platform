import api, { getData } from './api';

export const programmingService = {
  getQuestions: (level) => api.get('/api/programming/questions', { params: { level } }).then(getData),
  getQuestion: (id) => api.get(`/api/programming/questions/${id}`).then(getData),
  submitCode: (data) => api.post('/api/programming/submit', data).then(getData),
  getResults: () => api.get('/api/programming/results').then(getData),
};
