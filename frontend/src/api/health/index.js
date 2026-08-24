import axiosInstance from '../axios/axiosInterceptors';

export const checkHealth = () => axiosInstance.get('/health');
