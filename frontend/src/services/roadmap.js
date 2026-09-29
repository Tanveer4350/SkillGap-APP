import api from './api';

export const getRoadmap = async () => {
  const res = await api.get('/roadmap');
  return res.data;
};

export const generateRoadmap = async (target_role_id) => {
  const res = await api.post('/roadmap/generate', { target_role_id });
  return res.data;
};

export const updateRoadmapItemStatus = async (itemId, status) => {
  const res = await api.put(`/roadmap/items/${itemId}`, { status });
  return res.data;
};
