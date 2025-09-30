import { fetchConversationSubjects } from '@/actions/conversation';
import {
    messageCreated,
    messageUnreadIncremented,
    messageUnreadReset,
} from '@/actions/event-bus-actions';
import useEventBus from '@/contexts/EventBus';
import { createContext, useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router';

interface ChatContextType {
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

const ChatContext = createContext<ChatContextType | undefined>(undefined);

export const ChatProvider = ({ children }: { children: React.ReactNode }) => {
    const [conversations, setConversations] = useState<Conversation[]>([]);
    const [selectedConversation, setSelectedConversation] =
        useState<Conversation | null>(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const { conversationId } = useParams();
    const { on } = useEventBus();

    useEffect(() => {
        const offCreated = on('message.created', (message: Message) =>
            messageCreated(message, setConversations)
        );
        const offIncrement = on('unread.increment', (message: Message) =>
            messageUnreadIncremented(message, setConversations)
        );
        const offReset = on('unread.reset', (conversation: Conversation) =>
            messageUnreadReset(conversation, setConversations)
        );

        return () => {
            offCreated();
            offIncrement();
            offReset();
        };
    }, [on]);

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
    const updateConversations = (
        updater: (prev: Conversation[]) => Conversation[]
    ) => {
        setConversations(updater);
    };

    useEffect(() => {
        fetchConversations();
    }, []);

    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(
                (c) => c.id === Number(conversationId)
            );
            setSelectedConversation(conversation || null);
        } else if (!conversationId) {
            setSelectedConversation(null);
        }
    }, [conversationId, conversations]);

    const handleSetSelectedConversation = (
        conversation: Conversation | null
    ) => {
        setSelectedConversation(conversation);
        // Other logic like navigation to the conversation route goes here
    };

    // const isTransitioning = prevConversationId !== conversationId;
    const hasConversationId = !!conversationId;

    console.log(hasConversationId, !selectedConversation, !loading);

    const isLoadingConversation =
        hasConversationId && !selectedConversation && loading;
    const conversationNotFound =
        hasConversationId && !selectedConversation && !loading;

    return (
        <ChatContext.Provider
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
        </ChatContext.Provider>
    );
};

export const useChatContext = () => {
    const context = useContext(ChatContext);
    if (context === undefined) {
        throw new Error('useChatContext must be used within a ChatProvider');
    }
    return context;
};
