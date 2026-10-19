import api from '../axios/axiosInterceptors';

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validId = (id) => MONGO_ID_RE.test(id);

export const getIncomes   = ()         => api.get('/income');
export const createIncome = (data)     => api.post('/income', data);
export const updateIncome = (id, data) => validId(id) ? api.put(`/income/${id}`, data) : Promise.reject(new Error('Invalid id'));
export const deleteIncome = (id)       => validId(id) ? api.delete(`/income/${id}`)    : Promise.reject(new Error('Invalid id'));
