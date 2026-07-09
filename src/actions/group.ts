import { routes } from '@/config/routes';
import api from '@/lib/api';
import { normalizeBackendGroup } from '@/lib/dto';
import { handleApiError } from '@/lib/handle-api-erros';
import type { CreateGroupRequest } from './request-types';
import type { CreateGroupResponse } from './response-types';

export const createGroup = async (data: CreateGroupRequest) => {
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
