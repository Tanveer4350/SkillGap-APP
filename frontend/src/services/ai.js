import api from './api';

export const chatWithAICareerAssistant = async (message, history = []) => {
  const res = await api.post('/ai/chat', { message, history });
  return res.data;
};

export const analyzeFullProfileWithAI = async () => {
  const res = await api.post('/ai/analyze-profile');
  return res.data;
};
