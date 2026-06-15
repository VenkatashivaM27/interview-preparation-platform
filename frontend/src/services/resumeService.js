import api, { getData } from './api';

export const resumeService = {
  analyze: (file) => {
    const form = new FormData();
    form.append('file', file);
    return api.post('/api/resumes/analyze', form, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(getData);
  },
  getResumes: () => api.get('/api/resumes').then(getData),
  getLatest: () => api.get('/api/resumes/latest').then(getData),
};
