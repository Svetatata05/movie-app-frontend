import axios from 'axios';
import { store } from '../app/store';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000/api/v1';

const axiosInstance = axios.create({
  baseURL: API_URL,
});

// Інтерцептор додає токен із redux store у заголовки Authorization
axiosInstance.interceptors.request.use((config) => {
  const token = store.getState().user.token;

  if (token) {
    config.headers = config.headers || {};
    config.headers.Authorization = `Bearer ${token}`;
  }

  console.log(`Запит: ${config.method?.toUpperCase()} ${config.baseURL}${config.url}`);
  console.log('Authorization header:', config.headers.Authorization);

  return config;
});

export default axiosInstance;
