import api from '../axios/axiosInterceptors';

export const getAllBudgetPlans = ()             => api.get('/budget-plan/all');
export const getBudgetPlan    = (month, year)  => api.get('/budget-plan', { params: { month, year } });
export const saveBudgetPlan   = (data)         => api.post('/budget-plan', data);
