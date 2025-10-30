// hooks/useSendMessage.ts
import { createPrivateConversation } from '@/actions/conversation';
import { createTempMessage, sendMessage } from '@/actions/message';
import { ConversationTypeEnum } from '@/enums/enums';
import { useCallback, useState } from 'react';

export const useSendMessage = () => {
    const [sending, setSending] = useState(false);
    const [progress, setProgress] = useState<number | null>(null);
    const [error, setError] = useState<string | null>(null);

    // For existing conversations
    const send = useCallback(
        async (
            messageText: string,
            attachments: Attachment[],
            conversation: Conversation,
            user: User,
            callbacks?: {
                onOptimisticUpdate?: (
                    tempMessage: Message & { tempId: string }
                ) => void;
                onSuccess?: (realMessage: Message, tempId: string) => void;
                onError?: (tempId: string, error: Error) => void;
            }
        ) => {
            setSending(true);
            setError(null);
            setProgress(null);

            const tempMessage = createTempMessage(
                messageText,
                attachments,
                conversation,
                user
            );

            // Trigger optimistic update
            callbacks?.onOptimisticUpdate?.(tempMessage);

            try {
                const data = new FormData();

                attachments.forEach((file) =>
                    data.append('attachments[]', file.file)
                );

                data.append('message', messageText);

                if (conversation.type === ConversationTypeEnum.PRIVATE) {
                    data.append('receiver_id', `${conversation.typeId}`);
                } else if (conversation.type === ConversationTypeEnum.GROUP) {
                    data.append('group_id', `${conversation.typeId}`);
                }

                const realMessage = await sendMessage(
                    data,
                    conversation.id,
                    (p) => setProgress(p)
                );

                callbacks?.onSuccess?.(realMessage, tempMessage.tempId);
                return realMessage;
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Failed to send message');
                setError(error.message);
                callbacks?.onError?.(tempMessage.tempId, error);
                throw err;
            } finally {
                setSending(false);
            }
        },
        []
    );

    // For new conversations
    const sendFirstMessage = useCallback(
        async (
            messageText: string,
            attachments: Attachment[],
            receiverId: number,
            user: User,
            callbacks?: {
                onOptimisticUpdate?: (
                    tempMessage: Message & { tempId: string },
                    tempConversation: Conversation
                ) => void;
                onSuccess?: (
                    conversation: Conversation,
                    message: Message
                ) => void;
                onError?: (error: Error) => void;
            }
        ) => {
            setSending(true);
            setError(null);

            // Create temp conversation for optimistic update
            const tempConversation: Conversation = {
                id: 0,
                name: '', // You'd need to pass the other user's name
                type: 'private',
                typeId: receiverId,
                avatar: '',
                lastMessage: messageText,
                lastMessageAttachmentCount: attachments.length,
                lastMessageSenderId: user?.id || 0,
                lastMessageDate: new Date().toISOString(),
                unreadMessageCount: 0,
            };

            const tempMessage = createTempMessage(
                messageText,
                attachments,
                tempConversation,
                user
            );

            callbacks?.onOptimisticUpdate?.(tempMessage, tempConversation);

            try {
                const reqMessage = {
                    message: messageText,
                    attachments: attachments,
                };

                const { conversation, message } =
                    await createPrivateConversation(receiverId, reqMessage);

                callbacks?.onSuccess?.(conversation, message);
                return { conversation, message };
            } catch (err) {
                const error =
                    err instanceof Error
                        ? err
                        : new Error('Failed to create conversation');
                setError(error.message);
                callbacks?.onError?.(error);
                throw err;
            } finally {
                setSending(false);
            }
        },
        []
    );

    return { send, sendFirstMessage, sending, progress, error };
};
