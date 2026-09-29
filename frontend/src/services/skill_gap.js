import api from './api';

export const getLatestSkillGap = async () => {
  const res = await api.get('/skill-gap');
  return res.data;
};

export const analyzeRoleGap = async (target_role_id, target_role_name, custom_role_description) => {
  const res = await api.post('/skill-gap/analyze', {
    target_role_id,
    target_role_name,
    custom_role_description,
  });
  return res.data;
};

export const analyzeJobDescription = async (job_title, company_name, job_description_text) => {
  const res = await api.post('/skill-gap/analyze-job-description', {
    job_title,
    company_name,
    job_description_text,
  });
  return res.data;
};

export const getTargetRoles = async () => {
  const res = await api.get('/roles');
  return res.data;
};
