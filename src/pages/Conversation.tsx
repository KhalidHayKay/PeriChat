import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import ConversationMessages from '@/components/conversation/ConversationMessages';
import ConversationNotFoundError from '@/components/errors/ConversationNotFoundError';
import ConversationHeaderSkeleton from '@/components/skeletons/ConversationHeaderSkeleton';
import ConversationInputSkeleton from '@/components/skeletons/ConversationInputSkeleton';
import ConversationMessagesSkeleton from '@/components/skeletons/ConversationMessagesSkeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useMessages } from '@/hooks/useMessages';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useTempMessages } from '@/hooks/useTempMessages';
import { useCallback, useMemo } from 'react';

const Conversation = () => {
    const { user } = useAuthContext();
    const {
        isLoadingConversation,
        conversationNotFound,
        selectedConversation,
        updateConversations,
    } = useConversationContext();
    const { send } = useSendMessage();
    const {
        getTempMessages,
        addTempMessage,
        updateTempMessage,
        removeTempMessage,
        version,
    } = useTempMessages();
    const { messages, setMessages, refreshMessages, error, loading } =
        useMessages(selectedConversation);

    const mergedMessages = useMemo(() => {
        const temps = getTempMessages(selectedConversation?.id ?? 0);
        return [...messages, ...temps].sort(
            (a, b) =>
                new Date(a.createdAt).getTime() -
                new Date(b.createdAt).getTime()
        );
    }, [messages, selectedConversation, getTempMessages, version]);

    const handleSend = useCallback(
        (
            messageText: string,
            attachments: Attachment[],
            conversation: Conversation
        ) => {
            return send(messageText, attachments, conversation, user, {
                onOptimisticUpdate: (tempMessage) => {
                    // setMessages((prev) => [...prev, tempMessage]);

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

                    addTempMessage(tempMessage);
                },
                onSuccess: (realMessage, tempMessage) => {
                    // setMessages((prev) =>
                    //     prev.map((m) =>
                    //         m.tempId === tempMessage.tempId
                    //             ? { ...realMessage, status: 'delivered' }
                    //             : m
                    //     )
                    // );

                    setMessages((prev) => [
                        ...prev,
                        { ...realMessage, status: 'delivered' },
                    ]);

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? { ...c, lastMessageStatus: 'delivered' }
                                : c
                        )
                    );

                    removeTempMessage(tempMessage);
                },
                onError: (tempMessage: Message) => {
                    // setMessages((prev) =>
                    //     prev.map((m) =>
                    //         m.tempId === tempMessage.tempId
                    //             ? { ...m, status: 'failed' }
                    //             : m
                    //     )
                    // );

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? { ...c, lastMessageStatus: 'failed' }
                                : c
                        )
                    );

                    updateTempMessage(tempMessage, { status: 'failed' });
                },
            });
        },
        [
            send,
            user,
            setMessages,
            updateConversations,
            addTempMessage,
            removeTempMessage,
            updateTempMessage,
        ]
    );

    const handleRetryMessage = useCallback(
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

            // Resend it
            await handleSend(
                failedMessage.message,
                attachments,
                selectedConversation as Conversation
            );
        },
        [handleSend, selectedConversation, setMessages, removeTempMessage]
    );

    if (isLoadingConversation) {
        return (
            <>
                <ConversationHeaderSkeleton />
                <div className='flex-1 bg-secondary/50 overflow-hidden relative'>
                    <ConversationMessagesSkeleton />
                </div>
                <ConversationInputSkeleton />
            </>
        );
    }

    if (conversationNotFound) return <ConversationNotFoundError />;

    return (
        // using 'selectedConversation as Conversation' because at this point, it is guaranteed to be non-null
        // might find a way to assert that later
        <>
            <ConversationHeader
                selectedConversation={selectedConversation as Conversation}
            />

            <div className='flex-1 bg-secondary/50 overflow-hidden relative'>
                <ConversationMessages
                    messages={mergedMessages}
                    setMessages={setMessages}
                    refreshMessages={refreshMessages}
                    loading={loading}
                    error={error}
                    selectedConversation={selectedConversation as Conversation}
                    user={user}
                    onRetryMessage={handleRetryMessage}
                />
            </div>

            <ConversationInput
                conversation={selectedConversation as Conversation}
                handleSend={handleSend}
            />
        </>
    );
};

export default Conversation;
