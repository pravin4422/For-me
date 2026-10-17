import axios from 'axios';
import config from '../../config';
import { auth } from '../../config/firebase';

const axiosInstance = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 15000,
  headers: { 'Content-Type': 'application/json' },
});

axiosInstance.interceptors.request.use(async (cfg) => {
  const user = auth.currentUser;
  if (user) {
    const token = await user.getIdToken();
    cfg.headers.Authorization = `Bearer ${token}`;
  }
  return cfg;
});

export default axiosInstance;
