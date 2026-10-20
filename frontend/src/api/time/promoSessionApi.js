import api from '../axios/axiosInterceptors';

export const getPromoSessions   = ()     => api.get('/promo-sessions');
export const createPromoSession = (data) => api.post('/promo-sessions', data);
export const deletePromoSession = (id)   => api.delete(`/promo-sessions/${id}`);
export const savePromoProgress  = (data) => api.post('/promo-sessions/progress', data);
