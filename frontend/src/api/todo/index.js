import api from '../axios/axiosInterceptors';

export const getTodos       = ()           => api.get('/todo');
export const createTodo     = (data)       => api.post('/todo', data);
export const updateTodo     = (id, data)   => api.put(`/todo/${id}`, data);
export const deleteTodo     = (id)         => api.delete(`/todo/${id}`);
export const toggleTodo     = (id)         => api.patch(`/todo/${id}/toggle`);
export const logComplete    = (id, data)   => api.post(`/todo/${id}/complete`, data);
export const getOverview    = (id)         => api.get(`/todo/${id}/overview`);
export const getScore       = (id, range)  => api.get(`/todo/${id}/score`, { params: { range } });
export const getHistory     = (id, range)  => api.get(`/todo/${id}/history`, { params: { range } });
export const getCalendar    = (id, year, month) => api.get(`/todo/${id}/calendar`, { params: { year, month } });
export const getStreaks     = (id)         => api.get(`/todo/${id}/streaks`);
export const getFrequency   = (id)         => api.get(`/todo/${id}/frequency`);
