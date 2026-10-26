import api from '../axios/axiosInterceptors';

export const getTimeActivities  = ()         => api.get('/time-activities');
export const createTimeActivity = (data)     => api.post('/time-activities', data);
export const updateTimeActivity = (id, data) => api.put(`/time-activities/${id}`, data);
export const deleteTimeActivity = (id)       => api.delete(`/time-activities/${id}`);

export const getTimeLogs   = (from, to) => api.get('/time-logs', { params: { from, to } });
export const toggleTimeLog = (data)     => api.post('/time-logs/toggle', data);
