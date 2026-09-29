import api from './api';

export const getProfile = async () => {
  const res = await api.get('/profile');
  return res.data;
};

export const updateProfile = async (payload) => {
  const res = await api.put('/profile', payload);
  return res.data;
};

export const getProfileCompletion = async () => {
  const res = await api.get('/profile/completion');
  return res.data;
};

export const getMySkills = async () => {
  const res = await api.get('/skills/my');
  return res.data;
};

export const getAllTaxonomySkills = async () => {
  const res = await api.get('/skills');
  return res.data;
};

export const addStudentSkill = async (payload) => {
  const res = await api.post('/skills/my', payload);
  return res.data;
};

export const bulkAddSkills = async (skills) => {
  const res = await api.post('/skills/my/bulk', { skills });
  return res.data;
};

export const deleteStudentSkill = async (id) => {
  const res = await api.delete(`/skills/my/${id}`);
  return res.data;
};

export const getProjects = async () => {
  const res = await api.get('/projects');
  return res.data;
};

export const createProject = async (payload) => {
  const res = await api.post('/projects', payload);
  return res.data;
};

export const updateProject = async (id, payload) => {
  const res = await api.put(`/projects/${id}`, payload);
  return res.data;
};

export const deleteProject = async (id) => {
  const res = await api.delete(`/projects/${id}`);
  return res.data;
};

export const uploadResume = async (file) => {
  const formData = new FormData();
  formData.append('file', file);
  const res = await api.post('/resume/upload', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return res.data;
};

export const getLatestResumeAnalysis = async () => {
  const res = await api.get('/resume/latest');
  return res.data;
};

export const connectGitHub = async (username) => {
  const res = await api.post('/github/connect', { username });
  return res.data;
};

export const getGitHubProfile = async () => {
  const res = await api.get('/github/profile');
  return res.data;
};

export const getSkillEvidence = async () => {
  const res = await api.get('/evidence');
  return res.data;
};

export const getPlacementAnalytics = async () => {
  const res = await api.get('/placement/analytics');
  return res.data;
};
