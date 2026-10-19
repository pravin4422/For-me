import api from '../axios/axiosInterceptors';

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validId = (id) => MONGO_ID_RE.test(id);

export const getSavings    = ()         => api.get('/savings');
export const createSaving  = (data)     => api.post('/savings', data);
export const updateSaving  = (id, data) => validId(id) ? api.put(`/savings/${id}`, data) : Promise.reject(new Error('Invalid id'));
export const deleteSaving  = (id)       => validId(id) ? api.delete(`/savings/${id}`)    : Promise.reject(new Error('Invalid id'));
