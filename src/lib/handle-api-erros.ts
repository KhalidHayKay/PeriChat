import axios from 'axios';

export function handleApiError(error: unknown): never {
    if (axios.isAxiosError(error)) {
        if (error.response) {
            const status = error.response.status;
            const serverMessage =
                error.response.data?.message || error.response.statusText;

            if (status >= 500) {
                console.error('Server error:', serverMessage);
                throw new Error('Server error. Please try again later.');
            }

            if (status === 404) {
                console.warn('Not found:', serverMessage);
                throw new Error('Something went wrong. Please try again.');
            }

            if ([422, 403, 401].includes(status)) {
                throw new Error(serverMessage);
            }

            throw new Error(`Request failed: ${serverMessage}`);
        }

        if (error.request) {
            console.error('Network issue:', error.request);
            throw new Error('Network error. Please check your connection.');
        }

        console.error('Axios setup error:', error.message);
        throw new Error('Unexpected error occurred. Please try again.');
    }

    // Non-Axios errors
    console.error('Unknown error:', error);
    throw new Error('Unexpected error occurred. Please try again.');
}
