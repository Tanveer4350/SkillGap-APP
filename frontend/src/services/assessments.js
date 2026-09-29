import api from './api';

export const getAssessments = async () => {
  const res = await api.get('/assessments');
  return res.data;
};

export const getAssessmentDetail = async (id) => {
  const res = await api.get(`/assessments/${id}`);
  return res.data;
};

export const submitAssessment = async (id, answers) => {
  const res = await api.post(`/assessments/${id}/submit`, { answers });
  return res.data;
};
