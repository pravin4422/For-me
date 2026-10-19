import api from '../axios/axiosInterceptors';

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validId = (id) => MONGO_ID_RE.test(id);

export const getExpenses    = ()         => api.get('/expenses');
export const createExpense  = (data)     => api.post('/expenses', data);
export const updateExpense  = (id, data) => validId(id) ? api.put(`/expenses/${id}`, data) : Promise.reject(new Error('Invalid id'));
export const deleteExpense  = (id)       => validId(id) ? api.delete(`/expenses/${id}`)    : Promise.reject(new Error('Invalid id'));
