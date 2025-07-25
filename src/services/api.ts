import axios, { AxiosInstance, AxiosResponse } from 'axios';

// Configuration de base d'axios
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3001/api';

// Instance axios configurée
const api: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Intercepteur pour ajouter le token d'authentification
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Intercepteur pour gérer les réponses et erreurs
api.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  (error) => {
    // Gestion des erreurs d'authentification
    if (error.response?.status === 401) {
      localStorage.removeItem('authToken');
      localStorage.removeItem('user');
      window.location.href = '/';
    }
    
    // Log des erreurs en développement
    if (import.meta.env.DEV) {
      console.error('API Error:', error.response?.data || error.message);
    }
    
    return Promise.reject(error);
  }
);

// Types pour les réponses API
export interface ApiResponse<T = any> {
  data: T;
  message?: string;
}

export interface ApiError {
  error: string;
  code: string;
  details?: any;
}

// Fonctions utilitaires pour les appels API
export const apiCall = {
  get: <T = any>(url: string, params?: any): Promise<AxiosResponse<T>> =>
    api.get(url, { params }),
  
  post: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
    api.post(url, data),
  
  put: <T = any>(url: string, data?: any): Promise<AxiosResponse<T>> =>
    api.put(url, data),
  
  delete: <T = any>(url: string): Promise<AxiosResponse<T>> =>
    api.delete(url),
  
  upload: <T = any>(url: string, formData: FormData): Promise<AxiosResponse<T>> =>
    api.post(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    }),
};

export default api;
