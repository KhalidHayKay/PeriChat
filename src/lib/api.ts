import { env } from '@/config/env';
import type {
    AxiosInstance,
    AxiosResponse,
    InternalAxiosRequestConfig,
} from 'axios';
import axios from 'axios';
import { triggerLogout } from './triggerLogout';

export interface ApiResponse<T> {
    data: T;
    message?: string;
    status: number;
}

const api: AxiosInstance = axios.create({
    baseURL: env.api.url,
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

api.interceptors.response.use(
    (response: AxiosResponse) => response,
    (error) => {
        if (error.response?.status === 401) {
            const path = window.location.pathname;
            const isAuthRoute = [
                '/login',
                '/register',
                '/forgot-password',
            ].some((authPath) => path.startsWith(authPath));
            if (!isAuthRoute) {
                triggerLogout();
            }
        }

        return Promise.reject(error);
    }
);

export default api;
