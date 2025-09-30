import { routes } from '@/config/routes';
import { ConversationTypeEnum } from '@/enums/enums';
import api from '@/lib/api';
import { handleApiError } from '@/lib/handle-api-erros';

export const fetchMessages = async (conversationId: number) => {
    try {
        const res = await api.get(
            routes.api.conversation.messages(conversationId)
        );
        console.log(res.data);
        return res.data;
    } catch (error) {
        handleApiError(error);
    }
};

export const sendMessage = async (
    messageText: string,
    attachments: Attachment[],
    conversation: Conversation,
    onUploadProgress?: (progress: number) => void
) => {
    try {
        const data = new FormData();

        // Add attachments
        attachments.forEach((file) => data.append('attachments[]', file.file));

        // Add message text
        data.append('message', messageText);

        // Add conversation target
        if (conversation.type === ConversationTypeEnum.PRIVATE) {
            data.append('receiver_id', `${conversation.typeId}`);
        } else if (conversation.type === ConversationTypeEnum.GROUP) {
            data.append('group_id', `${conversation.typeId}`);
        }

        const response = await api.post(routes.api.message.send, data, {
            onUploadProgress: (progressEvent) => {
                if (progressEvent.total && onUploadProgress) {
                    const progress = Math.round(
                        (progressEvent.loaded / progressEvent.total) * 100
                    );
                    onUploadProgress(progress);
                }
            },
        });

        return response.data;
    } catch (error) {
        console.error('Failed to send message:', error);
        handleApiError(error);
    }
};

export const loadOlderMessages = async (lastMessageId: number) => {
    try {
        const res = await api.get(routes.api.message.loadOlder(lastMessageId));
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
