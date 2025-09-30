import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

const api: AxiosInstance = axios.create({
    baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000/api',
    timeout: 60 * 1000,
    headers: {
        'Content-Type': 'application/json',
    },
});

// Request interceptor: attach token
api.interceptors.request.use(
    (config: InternalAxiosRequestConfig) => {
        const token = localStorage.getItem('authToken');

        // Ensure headers exist
        config.headers = config.headers ?? {};
        if (token) {
            config.headers['Authorization'] = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// Response interceptor
api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            // handle unauthorized
        }
        return Promise.reject(error);
    }
);

export default api;
