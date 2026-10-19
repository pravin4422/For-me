import api from '../axios/axiosInterceptors';

const MONGO_ID_RE = /^[a-f\d]{24}$/i;
const validId = (id) => MONGO_ID_RE.test(id);

export const getTodos            = ()               => api.get('/todo');
export const createTodo          = (data)           => api.post('/todo', data);
export const updateTodo          = (id, data)       => validId(id) ? api.put(`/todo/${id}`, data)           : Promise.reject(new Error('Invalid id'));
export const deleteTodo          = (id)             => validId(id) ? api.delete(`/todo/${id}`)               : Promise.reject(new Error('Invalid id'));
export const getDeletedTodos     = ()               => api.get('/todo/trash');
export const permanentDeleteTodo = (id)             => validId(id) ? api.delete(`/todo/trash/${id}`)         : Promise.reject(new Error('Invalid id'));
export const toggleTodo          = (id)             => validId(id) ? api.patch(`/todo/${id}/toggle`)         : Promise.reject(new Error('Invalid id'));
export const logComplete         = (id, data)       => validId(id) ? api.post(`/todo/${id}/complete`, data)  : Promise.reject(new Error('Invalid id'));
export const getOverview         = (id)             => validId(id) ? api.get(`/todo/${id}/overview`)         : Promise.reject(new Error('Invalid id'));
export const getScore            = (id, range)      => validId(id) ? api.get(`/todo/${id}/score`, { params: { range } }) : Promise.reject(new Error('Invalid id'));
export const getHistory          = (id, range)      => validId(id) ? api.get(`/todo/${id}/history`, { params: { range } }) : Promise.reject(new Error('Invalid id'));
export const getCalendar         = (id, year, month)=> validId(id) ? api.get(`/todo/${id}/calendar`, { params: { year, month } }) : Promise.reject(new Error('Invalid id'));
export const getStreaks          = (id)             => validId(id) ? api.get(`/todo/${id}/streaks`)          : Promise.reject(new Error('Invalid id'));
export const getFrequency        = (id)             => validId(id) ? api.get(`/todo/${id}/frequency`)        : Promise.reject(new Error('Invalid id'));
