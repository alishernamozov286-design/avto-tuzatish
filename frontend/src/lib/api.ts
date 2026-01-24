import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor to handle auth errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export default api;

// AI Diagnostic API
export const aiApi = {
  getDiagnosticAdvice: async (data: { problem: string; carModel?: string }) => {
    const response = await api.post('/ai/diagnostic', data);
    return response.data;
  }
};

// Chat API
export const chatApi = {
  sendMessage: async (data: { message: string; sessionId: string; language?: 'latin' | 'cyrillic' }) => {
    const response = await api.post('/chat/message', data);
    return response.data;
  },
  
  getHistory: async (sessionId: string, limit?: number) => {
    const response = await api.get(`/chat/history/${sessionId}`, {
      params: { limit }
    });
    return response.data;
  },
  
  clearHistory: async (sessionId: string) => {
    const response = await api.delete(`/chat/history/${sessionId}`);
    return response.data;
  },
  
  getSubscription: async () => {
    const response = await api.get('/chat/subscription');
    return response.data;
  }
};
