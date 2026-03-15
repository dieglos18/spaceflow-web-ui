import axios, { type AxiosError } from 'axios';

const baseURL = (import.meta.env.VITE_API_URL ?? 'http://localhost:3000').replace(/\/$/, '');

export const apiClient = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request: add Bearer token from localStorage (set after login)
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('auth_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response: global error handling (log and rethrow so callers can handle)
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<{ message?: string; statusCode?: number; error?: string }>) => {
    const status = error.response?.status;
    const message = error.response?.data?.message ?? error.message;

    switch (status) {
      case 401:
        console.error('[API] Unauthorized:', message);
        break;
      case 404:
        console.error('[API] Not found:', message);
        break;
      case 409:
        console.error('[API] Conflict:', message);
        break;
      case 400:
        console.error('[API] Validation error:', message);
        break;
      case 500:
        console.error('[API] Server error:', message);
        break;
      default:
        console.error('[API] Error', status, message);
    }

    return Promise.reject(error);
  }
);
