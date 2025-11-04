import { fetchConversationSubjects } from '@/actions/conversation';
import {
    incrementUnreadMessageCount,
    resetUnreadMessageCount,
} from '@/actions/message-event';
import { useAppEventContext } from '@/contexts/AppEventsContext';
import {
    createContext,
    useCallback,
    useContext,
    useEffect,
    useState,
} from 'react';

import { useParams } from 'react-router';

interface ConversationContextType {
    conversations: Conversation[];
    selectedConversation: Conversation | null;
    loading: boolean;
    error: string | null;
    setSelectedConversation: (conversation: Conversation | null) => void;
    refreshConversations: () => Promise<void>;
    updateConversations: (
        updater: (prev: Conversation[]) => Conversation[]
    ) => void;
    isLoadingConversation: boolean;
    conversationNotFound: boolean;
    hasConversationId: boolean;
}

const ConversationContext = createContext<ConversationContextType | undefined>(
    undefined
);

export const ConversationProvider = ({
    children,
}: {
    children: React.ReactNode;
}) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    // hasSearchedForConversation here is more like "Has resolved selected conversation"
    const [hasSearchedForConversation, setHasSearchedForConversation] =
        useState(false);
    const { conversationId } = useParams();
    const { on } = useAppEventContext();

    useEffect(() => {
        const offIncrement = on('unread.increment', (message: Message) => {
            {
                if (Number(conversationId) === message.conversationId) return;

                incrementUnreadMessageCount(message, setConversations);
            }
        });
        const offReset = on('unread.reset', (conversation: Conversation) =>
            resetUnreadMessageCount(conversation, setConversations)
        );

        return () => {
            offIncrement();
            offReset();
        };
    }, [on, conversationId]);

    // Fetch conversations
    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchConversationSubjects();
            setConversations(data);
        } catch (error) {
            console.error('Failed to fetch conversations:', error);
            setError(
                error instanceof Error
                    ? error.message
                    : 'Failed to fetch conversations'
            );
        } finally {
            setLoading(false);
        }
    };

    // Refresh conversations (manually)
    const refreshConversations = async () => {
        await fetchConversations();
    };

    // Update conversations helper (for external updates)
    const updateConversations = useCallback(
        (updater: (prev: Conversation[]) => Conversation[]) => {
            setConversations(updater);
        },
        []
    );

    useEffect(() => {
        fetchConversations();
    }, []);

    // Handle conversation selection when conversationId or conversations change
    useEffect(() => {
        if (!conversationId) {
            setSelectedConversation(null);
            setHasSearchedForConversation(false);
            return;
        }

        // Reset search flag when conversationId changes
        setHasSearchedForConversation(false);

        // Only try to find conversation if we have data loaded
        if (conversations.length > 0) {
            const conversation = conversations.find(
                (c) => c.id === Number(conversationId)
            );

            // Only update if the conversation actually changed (by ID)
            setSelectedConversation((prev) => {
                if (!conversation) return null;
                if (prev?.id === conversation.id) return prev;
                return conversation;
            });
            setHasSearchedForConversation(true);
        }
    }, [conversationId, conversations]);

    const handleSetSelectedConversation = (
        conversation: Conversation | null
    ) => {
        setSelectedConversation(conversation);
    };

    const hasConversationId = !!conversationId;

    // Show loading when we have a conversationId but haven't finished searching
    const isLoadingConversation =
        hasConversationId && (!hasSearchedForConversation || loading);

    // Only show "not found" when we've actually searched and didn't find it
    const conversationNotFound =
        hasConversationId &&
        hasSearchedForConversation &&
        !selectedConversation &&
        !loading;

    return (
        <ConversationContext.Provider
            value={{
                conversations,
                selectedConversation,
                loading,
                error,
                setSelectedConversation: handleSetSelectedConversation,
                refreshConversations,
                updateConversations,
                isLoadingConversation,
                conversationNotFound,
                hasConversationId,
            }}
        >
            {children}
        </ConversationContext.Provider>
    );
};

export const useConversationContext = () => {
    const context = useContext(ConversationContext);
    if (context === undefined) {
        throw new Error(
            'useConversationContext must be used within a ConversationProvider'
        );
    }
    return context;
};
