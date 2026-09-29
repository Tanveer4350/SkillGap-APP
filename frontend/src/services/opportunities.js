import api from './api';

export const getOpportunities = async (filters = {}) => {
  const params = new URLSearchParams();
  if (filters.type && filters.type !== 'all') params.append('type', filters.type);
  if (filters.workplace_type && filters.workplace_type !== 'all') params.append('workplace_type', filters.workplace_type);
  if (filters.search) params.append('search', filters.search);

  const res = await api.get(`/opportunities?${params.toString()}`);
  return res.data;
};

export const getOpportunityDetail = async (id) => {
  const res = await api.get(`/opportunities/${id}`);
  return res.data;
};

export const analyzeOpportunityMatch = async (id) => {
  const res = await api.post(`/opportunities/${id}/analyze`);
  return res.data;
};
