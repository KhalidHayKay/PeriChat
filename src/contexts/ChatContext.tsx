import { fetchConversation } from '@/actions/conversation';
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

    // EventBus listeners for real-time updates
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

    // Fetch conversations function
    const fetchConversations = async () => {
        try {
            setLoading(true);
            setError(null);
            const data = await fetchConversation();
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

    // Refresh conversations (can be called manually)
    const refreshConversations = async () => {
        await fetchConversations();
    };

    // Update conversations helper (for external updates)
    const updateConversations = (
        updater: (prev: Conversation[]) => Conversation[]
    ) => {
        setConversations(updater);
    };

    // Fetch conversations on mount
    useEffect(() => {
        fetchConversations();
    }, []);

    // Update selected conversation when route changes
    useEffect(() => {
        if (conversationId && conversations.length > 0) {
            const conversation = conversations.find(
                (c) => c.id === Number(conversationId)
            );
            setSelectedConversation(conversation || null);
        } else {
            setSelectedConversation(null);
        }
    }, [conversationId, conversations]);

    // Manual setter for selected conversation (useful for programmatic selection)
    const handleSetSelectedConversation = (
        conversation: Conversation | null
    ) => {
        setSelectedConversation(conversation);
        // You might want to navigate to the conversation route here
        // navigate(`/chat/${conversation?.id || ''}`);
    };

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
