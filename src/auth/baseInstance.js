

import axios from 'axios';
import { apiURL } from './config';
import { getCookies, removeCookies } from '@/utils/cookies';

const api = axios.create({
  baseURL: apiURL,
  timeout: 10000,
});

api.interceptors.request.use((config) => {
  const token = getCookies('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, error => Promise.reject(error));

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response && error?.response?.status === 401) {
      removeCookies('token');
    };
    return Promise.reject(error);
  }
);
export default api;