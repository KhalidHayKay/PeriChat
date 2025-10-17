import { routes } from '@/config/routes';
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

export const fetchConversationSubjects = async () => {
    return handleRequest(routes.api.conversation.subjects);
};

export const fetchAppUsers = async () => {
    return handleRequest(routes.api.conversation.newUsers);
};

export const fetchPublicGroups = async () => {
    return handleRequest(routes.api.conversation.newGroups);
};

export const fetchUsersForNewGroup = async () => {
    return handleRequest(routes.api.conversation.newGroupUsers);
};

export const increment = (conversationId: number, messageId: number) => {
    api.post(routes.api.message.unread(conversationId, messageId)).catch(
        (err) => console.error(err)
    );
};

export const resetUnread = async (conversationId: number) => {
    api.post(routes.api.message.read(conversationId)).catch((err) =>
        console.error(err)
    );
};

const handleRequest = async (uri: string) => {
    try {
        const res = await api.get(uri);
        return res.data.data;
    } catch (error) {
        handleApiError(error);
    }
};
