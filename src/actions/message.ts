import { routes } from '@/config/routes';
import api from '@/lib/api';
import {
    normalizeBackendConversation,
    normalizeBackendMessage,
} from '@/lib/dto';
import { handleApiError } from '@/lib/handle-api-erros';
import { v4 as uuid } from 'uuid';
import type {
    CreateFirstMessageResponse,
    CreateMessageResponse,
    FetchMessageResponse,
} from './responses/message-response';

export const fetchMessages = async (conversationId: number) => {
    try {
        const res = await api.get<FetchMessageResponse>(
            routes.api.conversation.messages(conversationId)
        );
        const { messages, hasMore } = res.data.data;

        return {
            messages: messages.map(normalizeBackendMessage),
            hasMore,
        };
    } catch (error) {
        handleApiError(error);
        throw error;
    }
};

export const loadOlderMessages = async (
    conversationId: number,
    lastMessageId: number
) => {
    try {
        const res = await api.get<FetchMessageResponse>(
            routes.api.conversation.olderMessages(conversationId, lastMessageId)
        );
        const { messages, hasMore } = res.data.data;

        return {
            messages: messages.map(normalizeBackendMessage),
            hasMore,
        };
    } catch (error) {
        console.error('Failed to load older messages:', error);
        handleApiError(error);
    }
};

export const sendMessage = async (
    data: FormData,
    onUploadProgress?: (progress: number) => void
) => {
    try {
        const res = await api.post<CreateMessageResponse>(
            routes.api.message.send,
            data,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
                onUploadProgress: (progressEvent) => {
                    if (progressEvent.total && onUploadProgress) {
                        const progress = Math.round(
                            (progressEvent.loaded / progressEvent.total) * 100
                        );
                        onUploadProgress(progress);
                    }
                },
            }
        );

        return normalizeBackendMessage(res.data.data);
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
        throw error;
    }
};

export const createFirstEverMessage = async (data: FormData) => {
    try {
        const res = await api.post<CreateFirstMessageResponse>(
            routes.api.message.sendFirst,
            data,
            {
                headers: { 'Content-Type': 'multipart/form-data' },
            }
        );
        const { message, conversation } = res.data.data;
        return {
            message: normalizeBackendMessage(message),
            conversation: normalizeBackendConversation(conversation),
        };
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
        throw error;
    }
};

let tempIdCounter = -1;
export const createTempMessage = (
    value: string,
    files: Attachment[],
    conversation: Conversation,
    user: User
): Message => {
    return {
        tempId: uuid(),
        id: tempIdCounter--,
        message: value ?? '',
        conversationId: conversation.id,
        senderId: user.id,
        receiverId:
            conversation.type === 'private' ? conversation.typeId : null,
        groupId: conversation.type === 'group' ? conversation.typeId : null,
        sender: user,
        attachments:
            files.length > 0
                ? files.map((a) => ({
                      ...a,
                      url: URL.createObjectURL(a.file),
                  }))
                : null,
        createdAt: new Date().toISOString(),
        status: 'sending',
    };
};
