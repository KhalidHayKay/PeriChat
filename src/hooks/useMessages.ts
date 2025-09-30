// hooks/useMessages.ts
import { fetchMessages } from '@/actions/message';
import useEventBus from '@/contexts/EventBus';
import { ConversationTypeEnum } from '@/enums/enums';
import { useCallback, useEffect, useState } from 'react';

interface UseMessagesReturn {
    messages: Message[];
    setMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    loading: boolean;
    error: string | null;
    refreshMessages: () => Promise<void>;
}

export const useMessages = (
    selectedConversation: Conversation | null
): UseMessagesReturn => {
    const [messages, setMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const { on } = useEventBus();

    // Fetch messages for current conversation
    const fetchMessagesForConversation = useCallback(
        async (conversationId: number) => {
            setLoading(true);
            setError(null);

            try {
                const result = await fetchMessages(conversationId);
                if (result.messages) {
                    setMessages(result.messages.reverse());
                } else {
                    setMessages([]);
                }
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch messages'
                );
                setMessages([]);
            } finally {
                setLoading(false);
            }
        },
        []
    );

    // Manual refresh
    const refreshMessages = useCallback(async () => {
        if (selectedConversation) {
            await fetchMessagesForConversation(selectedConversation.id);
        }
    }, [selectedConversation, fetchMessagesForConversation]);

    // Event bus handler for new messages
    const handleMessageCreated = useCallback(
        (message: Message) => {
            if (!selectedConversation) return;

            const isForThisConversation =
                (selectedConversation.type === ConversationTypeEnum.GROUP &&
                    selectedConversation.typeId === message.groupId) ||
                (selectedConversation.type === ConversationTypeEnum.PRIVATE &&
                    !message.groupId &&
                    (selectedConversation.typeId === message.senderId ||
                        selectedConversation.typeId === message.receiverId));

            if (isForThisConversation) {
                setMessages((prev) => [...prev, message]);
            }
        },
        [selectedConversation]
    );

    // Load messages when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            setMessages([]);
            setError(null);
            fetchMessagesForConversation(selectedConversation.id);
        } else {
            setMessages([]);
        }
    }, [selectedConversation, fetchMessagesForConversation]);

    // Event bus subscription
    useEffect(() => {
        const offCreated = on('message.created', handleMessageCreated);
        return () => offCreated();
    }, [on, handleMessageCreated]);

    return {
        messages,
        setMessages,
        loading,
        error,
        refreshMessages,
    };
};
