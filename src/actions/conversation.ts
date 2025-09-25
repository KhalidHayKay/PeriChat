import api from '@/lib/api';
import { handleApiError } from '@/lib/handle-api-erros';

export const sortConversations = (conversationsArray: Conversation[]) => {
    return conversationsArray.sort((a: Conversation, b: Conversation) => {
        if (a.lastMessageDate && b.lastMessageDate) {
            return b.lastMessageDate.localeCompare(a.lastMessageDate);
        } else if (a.lastMessageDate) {
            return -1;
        } else if (b.lastMessageDate) {
            return 1;
        } else return 0;
    });
};

export const fetchConversation = async () => {
    return handleRequest('conversation/subjects');
};

export const fetchAppUsers = async () => {
    return handleRequest('conversation/new/users');
};

export const fetchPublicGroups = async () => {
    return handleRequest('conversation/new/groups');
};

export const fetchUsersForNewGroup = async () => {
    return handleRequest('conversation/new/group-users');
};

const handleRequest = async (uri: string) => {
    try {
        const res = await api.get(uri);
        return res.data.data;
    } catch (error) {
        handleApiError(error);
    }
};
