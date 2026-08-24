import axiosInstance from './axiosInstance';
import { auth } from '../../config/firebase';

// Attach Firebase ID token to every request
axiosInstance.interceptors.request.use(
  async (config) => {
    const user = auth.currentUser;
    if (user) {
      const token = await user.getIdToken();
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle 401 globally
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      auth.signOut();
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
