import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import ConversationMessages from '@/components/conversation/ConversationMessages';
import ConversationNotFoundError from '@/components/errors/ConversationNotFoundError';
import ConversationHeaderSkeleton from '@/components/skeletons/ConversationHeaderSkeleton';
import ConversationInputSkeleton from '@/components/skeletons/ConversationInputSkeleton';
import ConversationMessagesSkeleton from '@/components/skeletons/ConversationMessagesSkeleton';
import { useAuthContext } from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext';
import { useMessages } from '@/hooks/useMessages';

const Conversation = () => {
    const { user } = useAuthContext();
    const {
        isLoadingConversation,
        conversationNotFound,
        selectedConversation,
    } = useChatContext();
    const { messages, setMessages, error, loading } =
        useMessages(selectedConversation);

    // console.log(
    //     isLoadingConversation,
    //     conversationNotFound,
    //     selectedConversation,
    //     loading
    // );

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
                    loading={loading}
                    error={error}
                    selectedConversation={selectedConversation}
                    user={user}
                />
            </div>

            <ConversationInput
                conversation={selectedConversation as Conversation}
            />
        </>
    );
};

export default Conversation;
