import { fetchMessages } from '@/actions/message';
import { useCallback, useEffect, useState } from 'react';
import { useLocation } from 'react-router';

interface UseServerMessagesReturn {
    serverMessages: Message[];
    // setServerMessages: React.Dispatch<React.SetStateAction<Message[]>>;
    loading: boolean;
    error: string | null;
    refetchServerMessages: () => Promise<void>;
}

export const useServerMessages = (
    selectedConversation: Conversation | null
): UseServerMessagesReturn => {
    const [serverMessages, setServerMessages] = useState<Message[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const location = useLocation();

    // Fetch messages for current conversation
    const fetchMessagesForConversation = useCallback(
        async (conversationId: number) => {
            setLoading(true);
            setError(null);

            const state = location.state as {
                initialMessage?: Message;
                skipInitialFetch?: boolean;
            } | null;

            if (state?.skipInitialFetch && state?.initialMessage) {
                setServerMessages([state.initialMessage]);
                setLoading(false);

                window.history.replaceState({}, document.title);
                return;
            }

            try {
                const { data } = await fetchMessages(conversationId);
                const messages = data ? data.reverse() : [];

                setServerMessages(messages);
            } catch (err) {
                console.error('Failed to fetch messages:', err);
                setError(
                    err instanceof Error
                        ? err.message
                        : 'Failed to fetch messages'
                );
                setServerMessages([]);
            } finally {
                setLoading(false);
            }
        },
        [location.state]
    );

    // Manual refetch
    const refetchServerMessages = useCallback(async () => {
        if (selectedConversation) {
            await fetchMessagesForConversation(selectedConversation.id);
        }
    }, [selectedConversation, fetchMessagesForConversation]);

    // Load messages when conversation changes
    useEffect(() => {
        if (selectedConversation) {
            setServerMessages([]);
            setError(null);
            fetchMessagesForConversation(selectedConversation.id);
        } else {
            setServerMessages([]);
        }
    }, [selectedConversation, fetchMessagesForConversation]);

    return {
        serverMessages,
        // setServerMessages,
        loading,
        error,
        refetchServerMessages,
    };
};
