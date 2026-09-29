import api from './api';

export const getApplications = async () => {
  const res = await api.get('/applications');
  return res.data;
};

export const createApplication = async (payload) => {
  const res = await api.post('/applications', payload);
  return res.data;
};

export const updateApplication = async (id, payload) => {
  const res = await api.put(`/applications/${id}`, payload);
  return res.data;
};

export const deleteApplication = async (id) => {
  const res = await api.delete(`/applications/${id}`);
  return res.data;
};
