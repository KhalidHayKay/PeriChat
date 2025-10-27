import { routes } from '@/config/routes';
import api from '@/lib/api';
import { handleApiError } from '@/lib/handle-api-erros';

export const createGroup = async (data: any) => {
    try {
        const res = await api.post(routes.api.group.create, data);

        return res.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
    }
};

export const joinGroup = async (groupId: number) => {
    try {
        const res = await api.post(routes.api.group.join(groupId));
        return res.data.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
    }
};
