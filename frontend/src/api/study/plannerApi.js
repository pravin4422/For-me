import api from '../axios/axiosInterceptors';

export const getPlans   = (parentId = null, type = 'planner') =>
  api.get('/study-plans', { params: { ...(parentId ? { parentId } : {}), type } });
export const createPlan = (name, parentId = null, type = 'planner') =>
  api.post('/study-plans', { name, parentId, type });
export const deletePlan = (id)              => api.delete(`/study-plans/${id}`);
export const getItems   = (planId)          => api.get(`/study-plans/${planId}/items`);
export const createItem = (planId, text)    => api.post(`/study-plans/${planId}/items`, { text });
export const deleteItem  = (planId, itemId)  => api.delete(`/study-plans/${planId}/items/${itemId}`);
export const toggleItem    = (planId, itemId)  => api.patch(`/study-plans/${planId}/items/${itemId}/toggle`);
export const incrementItem = (planId, itemId)  => api.patch(`/study-plans/${planId}/items/${itemId}/increment`);
