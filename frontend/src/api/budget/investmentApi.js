import api from '../axios/axiosInterceptors';

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validId = (id) => MONGO_ID_RE.test(id);

export const getInvestments    = ()         => api.get('/investments');
export const createInvestment  = (data)     => api.post('/investments', data);
export const updateInvestment  = (id, data) => validId(id) ? api.put(`/investments/${id}`, data) : Promise.reject(new Error('Invalid id'));
export const deleteInvestment  = (id)       => validId(id) ? api.delete(`/investments/${id}`)    : Promise.reject(new Error('Invalid id'));
