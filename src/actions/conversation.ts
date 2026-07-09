import { routes } from '@/config/routes';
import api from '@/lib/api';
import { normalizeBackendConversation } from '@/lib/dto';
import { handleApiError } from '@/lib/handle-api-erros';
import type {
    ConversationSubjectResponse,
    ConversationSuggestionResponse,
} from './response-types';

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
    try {
        const res = await api.get<ConversationSubjectResponse>(
            routes.api.conversation.subjects
        );
        return res.data.data.map(normalizeBackendConversation);
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const fetchNonConversingUsers = async () => {
    try {
        const res = await api.get<ConversationSuggestionResponse>(
            routes.api.conversation.newUsers
        );
        return res.data.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const fetchJoinableGroups = async () => {
    try {
        const res = await api.get<ConversationSuggestionResponse>(
            routes.api.conversation.newGroups
        );
        return res.data.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const fetchUsersForNewGroup = async () => {
    try {
        const res = await api.get<{ message: string; data: User[] }>(
            routes.api.group.candidates
        );
        return res.data.data;
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};
