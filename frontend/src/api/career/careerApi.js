import api from '../axios/axiosInstance';

const H = (userId) => ({ headers: { 'X-User-Id': userId } });

// Skills
export const getSkills        = (userId, domain)    => api.get('/career/skills', { ...H(userId), params: { domain } });
export const addSkill         = (userId, data)       => api.post('/career/skills', data, H(userId));
export const updateSkillStatus= (id, status)         => api.patch(`/career/skills/${id}/status`, null, { params: { status } });
export const deleteSkill      = (id)                 => api.delete(`/career/skills/${id}`);

// Interview Prep
export const getPreps         = (userId, companyId)  => api.get('/career/interview-prep', { ...H(userId), params: { companyId } });
export const addPrep          = (userId, data)        => api.post('/career/interview-prep', data, H(userId));
export const updatePrep       = (id, data)            => api.put(`/career/interview-prep/${id}`, data);
export const deletePrep       = (id)                  => api.delete(`/career/interview-prep/${id}`);

// Resources
export const getResources     = (userId, category)   => api.get('/career/resources', { ...H(userId), params: { category } });
export const addResource      = (userId, data)        => api.post('/career/resources', data, H(userId));
export const deleteResource   = (id)                  => api.delete(`/career/resources/${id}`);
