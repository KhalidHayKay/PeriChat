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
                    // onRetryMessage={() => console.log('retry')}
                />
            </div>

            <ConversationInput
                user={user}
                conversation={selectedConversation as Conversation}
                setMessages={setMessages}
                updateConversations={updateConversations}
                hanldeSend={send}
                sending={sending}
            />
        </>
    );
};

export default Conversation;
