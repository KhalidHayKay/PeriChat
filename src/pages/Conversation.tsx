import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import ConversationMessages from '@/components/conversation/ConversationMessages';
import ConversationNotFoundError from '@/components/errors/ConversationNotFoundError';
import ConversationHeaderSkeleton from '@/components/skeletons/ConversationHeaderSkeleton';
import ConversationInputSkeleton from '@/components/skeletons/ConversationInputSkeleton';
import ConversationMessagesSkeleton from '@/components/skeletons/ConversationMessagesSkeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useConvesationMessages } from '@/hooks/useConvesationMessages';

const Conversation = () => {
    const { user } = useAuthContext();
    const {
        isLoadingConversation,
        conversationNotFound,
        selectedConversation,
    } = useConversationContext();
    const {
        conversationMessages,
        setConversationMessages,
        refreshMessages,
        loading,
        error,
        handleSend,
        handleResend,
    } = useConvesationMessages(user, selectedConversation);

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

            {/* <div className='flex-1 bg-secondary/50 overflow-hidden relative'> */}
            <ConversationMessages
                messages={conversationMessages}
                setMessages={setConversationMessages}
                refreshMessages={refreshMessages}
                loading={loading}
                error={error}
                selectedConversation={selectedConversation as Conversation}
                user={user}
                onRetryMessage={handleResend}
            />
            {/* </div> */}

            <ConversationInput
                conversation={selectedConversation as Conversation}
                handleSend={handleSend}
            />
        </>
    );
};

export default Conversation;
