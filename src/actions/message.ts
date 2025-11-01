import { routes } from '@/config/routes';
import api from '@/lib/api';
import { handleApiError } from '@/lib/handle-api-erros';
import { v4 as uuid } from 'uuid';

export const fetchMessages = async (conversationId: number) => {
    try {
        const res = await api.get(routes.api.message.load(conversationId));
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const loadOlderMessages = async (
    conversationId: number,
    lastMessageId: number
) => {
    try {
        const res = await api.get(
            routes.api.message.loadOlder(conversationId, lastMessageId)
        );
        const olderMessages = res.data.data as Message[];

        return {
            messages: olderMessages.reverse(),
            hasMore: olderMessages.length > 0,
        };
    } catch (error) {
        console.error('Failed to load older messages:', error);
        handleApiError(error);
    }
};

export const sendMessage = async (
    data: FormData,
    conversationId: number,
    onUploadProgress?: (progress: number) => void
) => {
    try {
        const res = await api.post(
            routes.api.message.send(conversationId),
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

        return res.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
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
        tempId: Number(uuid()),
        id: tempIdCounter--,
        message: value,
        conversationId: conversation.id,
        senderId: user.id,
        receiverId:
            conversation.type === 'PRIVATE' ? conversation.typeId : null,
        groupId: conversation.type === 'GROUP' ? conversation.typeId : null,
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
