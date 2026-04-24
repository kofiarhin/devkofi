import axios from 'axios';
import store from '../redux/store';
import { clearAdmin } from '../redux/auth/authSlice';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000',
  withCredentials: true,
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      store.dispatch(clearAdmin());
    }
    return Promise.reject(err);
  }
);

export default api;
