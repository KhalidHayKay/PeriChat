import { routes } from '@/config/routes';
import api from '@/lib/api';
import { normalizeBackendGroup } from '@/lib/dto';
import { handleApiError } from '@/lib/handle-api-erros';
import type { CreateGroupResponse } from './responses/group-response';

export const createGroup = async (data: any) => {
    try {
        const res = await api.post<CreateGroupResponse>(
            routes.api.group.create,
            data
        );
        return normalizeBackendGroup(res.data.data);
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
        throw error;
    }
};

export const joinGroup = async (groupId: number) => {
    try {
        const res = await api.post<CreateGroupResponse>(
            routes.api.group.join(groupId)
        );
        return normalizeBackendGroup(res.data.data);
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
        throw error;
    }
};
