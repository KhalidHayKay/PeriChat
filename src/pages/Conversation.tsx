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
import { useCallback } from 'react';

const Conversation = () => {
    const { user } = useAuthContext();
    const {
        isLoadingConversation,
        conversationNotFound,
        selectedConversation,
        updateConversations,
    } = useConversationContext();
    const { messages, setMessages, refreshMessages, error, loading } =
        useMessages(selectedConversation);
    const { send, sending } = useSendMessage();

    const handleSend = useCallback(
        (
            messageText: string,
            attachments: Attachment[],
            conversation: Conversation
        ) => {
            return send(messageText, attachments, conversation, user, {
                onOptimisticUpdate: (tempMessage) => {
                    setMessages((prev) => [...prev, tempMessage]);

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
                onSuccess: (realMessage, tempId) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            (m as any).tempId === tempId
                                ? { ...realMessage, status: 'delivered' }
                                : m
                        )
                    );

                    updateConversations((prev) =>
                        prev.map((c) =>
                            c.id === conversation.id
                                ? { ...c, lastMessageStatus: 'delivered' }
                                : c
                        )
                    );
                },
                onError: (tempId) => {
                    setMessages((prev) =>
                        prev.map((m) =>
                            (m as any).tempId === tempId
                                ? { ...m, status: 'failed' }
                                : m
                        )
                    );

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
        [send, user, setMessages, updateConversations]
    );

    const handleRetryMessage = useCallback(
        async (failedMessage: Message & { tempId: string }) => {
            // Remove the failed message
            setMessages((prev) =>
                prev.filter((m) => (m as any).tempId !== failedMessage.tempId)
            );

            // For temp/failed messages, attachments are always Attachment[] type
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
        [handleSend, selectedConversation, setMessages]
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
                    messages={messages}
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
                sending={sending}
            />
        </>
    );
};

export default Conversation;
