import api from '@/lib/api';
import { handleApiError } from '@/lib/handle-api-erros';

// const login = async (email, password) => {
//   try {
//     const response = await api.post('/api/login', { email, password });
//     return response.data;
//   } catch (error) {
//     // Handle error (either network error or server error)
//     if (error.response) {
//       // Request made and server responded with an error status
//       throw new Error(`Login failed: ${error.response.data?.message || error.response.statusText}`);
//     } else if (error.request) {
//       // Request made but no response received (e.g., network issues)
//       throw new Error('Login failed: No response from server');
//     } else {
//       // Error in setting up the request
//       throw new Error(`Login failed: ${error.message}`);
//     }
//   }
// };

export const register = async (credentials: SignUpCredentials) => {
    try {
        const response = await api.post('/auth/register', credentials);
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const login = async (email: string, password: string) => {
    try {
        const response = await api.post('/auth/login', {
            email,
            password,
        });
        return response.data;
    } catch (error) {
        handleApiError(error);
    }
};
