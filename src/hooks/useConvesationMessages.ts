import { useAppEventContext } from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useTempMessagesContext } from '@/contexts/TempMessagesContext';
import { ConversationTypeEnum } from '@/enums/enums';
import { useCallback, useEffect, useState } from 'react';
import { useSendMessage } from './useSendMessage';
import { useServerMessages } from './useServerMessages';

interface UseConvesationMessagesReturn {
    conversationMessages: Message[];
    setConversationMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    refreshMessages: () => Promise<void>;
    loading: boolean;
    error: string | null;
    handleSend: (
        messageText: string,
        attachments: Attachment[],
        conversation: Conversation
    ) => Promise<any>;
    handleResend: (failedMessage: Message) => Promise<void>;
}

export const useConvesationMessages = (
    user: User,
    conversation: Conversation | null
): UseConvesationMessagesReturn => {
    const { serverMessages, refetchServerMessages, error, loading } =
        useServerMessages(conversation);
    const { send } = useSendMessage();
    const {
        getTempMessages,
        addTempMessage,
        updateTempMessage,
        removeTempMessage,
    } = useTempMessagesContext();
    const { updateConversations } = useConversationContext();
    const { on } = useAppEventContext();
    const [messages, setMessages] = useState<Message[]>([]);

    useEffect(() => {
        const temps = getTempMessages(conversation?.id ?? 0);
        const mergedMessage = [...serverMessages, ...temps].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
        setMessages(mergedMessage);
    }, [serverMessages, conversation, getTempMessages]);

    const handleSend = useCallback(
        (
            messageText: string,
            attachments: Attachment[],
            conversation: Conversation
        ) => {
            return send(messageText, attachments, conversation, user, {
                onOptimisticUpdate: (tempMessage) => {
                    setMessages((prev) => [
                        ...prev,
                        { ...tempMessage, status: 'sending' },
                    ]);

                    addTempMessage(tempMessage);

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? {
                                      ...c,
                                      lastMessage: tempMessage.message,
                                      lastMessageDate: tempMessage.createdAt,
                                      lastMessageSenderId: tempMessage.senderId,
                                      lastMessageAttachmentCount:
                                          tempMessage.attachments?.length ?? 0,
                                      lastMessageStatus: 'sending',
                                  }
                                : c
                        )
                    );
                },
                onSuccess: (realMessage, tempMessage) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.tempId === tempMessage.tempId
                                ? { ...realMessage, status: 'delivered' }
                                : m
                        )
                    );

                    removeTempMessage(tempMessage);

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? { ...c, lastMessageStatus: 'delivered' }
                                : c
                        )
                    );
                },
                onError: (tempMessage: Message) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            m.tempId === tempMessage.tempId
                                ? { ...m, status: 'failed' }
                                : m
                        )
                    );

                    updateTempMessage(tempMessage, { status: 'failed' });

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? { ...c, lastMessageStatus: 'failed' }
                                : c
                        )
                    );
                },
            });
        },
        [
            send,
            user,
            setMessages,
            addTempMessage,
            removeTempMessage,
            updateTempMessage,
            updateConversations,
        ]
    );

    const handleResend = useCallback(
        async (failedMessage: Message) => {
            // Remove the failed message
            setMessages((prev) =>
                prev.filter((m) => m.tempId !== failedMessage.tempId)
            );
            removeTempMessage(failedMessage);

            const tempAttachments = failedMessage.attachments as
                | Attachment[]
                | null;

            let attachments: Attachment[] = [];

            if (tempAttachments && tempAttachments.length > 0) {
                attachments = await Promise.all(
                    tempAttachments.map(async (att) => {
                        // Fetch the blob from the blob URL
                        const response = await fetch(att.url);
                        const blob = await response.blob();

                        // Recreate the File object with original metadata
                        const file = new File([blob], att.file.name, {
                            type: att.file.type,
                        });

                        return {
                            file,
                            url: att.url, // Keep the same blob URL
                        };
                    })
                );
            }

            if (conversation)
                await handleSend(
                    failedMessage.message,
                    attachments,
                    conversation
                );
        },
        [handleSend, conversation, setMessages, removeTempMessage]
    );

    // Event bus handler for new messages
    const handleMessageCreatedEvent = useCallback(
        (message: Message) => {
            if (!conversation) return;

            const isForThisConversation =
                (conversation.type === ConversationTypeEnum.GROUP &&
                    conversation.typeId === message.groupId) ||
                (conversation.type === ConversationTypeEnum.PRIVATE &&
                    !message.groupId &&
                    (conversation.typeId === message.senderId ||
                        conversation.typeId === message.receiverId));

            if (isForThisConversation) {
                setMessages((prev) => [...prev, message]);
            }
        },
        [conversation]
    );

    // Event bus subscription
    useEffect(() => {
        const offCreated = on('message.created', handleMessageCreatedEvent);
        return () => offCreated();
    }, [on, handleMessageCreatedEvent]);

    return {
        conversationMessages: messages,
        setConversationMessages: setMessages,
        refreshMessages: refetchServerMessages,
        loading,
        error,
        handleSend,
        handleResend,
    };
};
