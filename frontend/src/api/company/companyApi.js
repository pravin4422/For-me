import api from '../axios/axiosInstance';

const H = (userId) => ({ headers: { 'X-User-Id': userId } });

export const getCompanies      = (userId)         => api.get('/companies', H(userId));
export const getCompaniesByType= (type, userId)   => api.get(`/companies/type/${type}`, H(userId));
export const createCompany     = (data)           => api.post('/companies', data);
export const updateCompany     = (id, data)       => api.put(`/companies/${id}`, data);
export const deleteCompany     = (id)             => api.delete(`/companies/${id}`);
export const getWatchlist      = (userId)         => api.get('/companies/watchlist', H(userId));
export const toggleWatchlist   = (id, userId)     => api.post(`/companies/${id}/watchlist`, {}, H(userId));
