import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import useAppEventContext from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useSendMessage } from '@/hooks/useSendMessage';
import { useCallback } from 'react';
import { useLocation, useNavigate } from 'react-router';

const NewPrivateConversation = () => {
    const navigate = useNavigate();
    // const { user } = useAuthContext();
    const { updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();
    const { sendFirstMessage, sending: isCreating } = useSendMessage();

    const { state } = useLocation();
    const otherUser = state?.otherUser as User | undefined;

    if (!otherUser) {
        navigate('/');
        return null;
    }

    const handleFirstMessage = useCallback(
        async (content: string, files: Attachment[]) => {
            try {
                const result = await sendFirstMessage(
                    content,
                    files,
                    Number(otherUser.id),
                    otherUser,
                    {
                        onSuccess: (conversation, message) => {
                            updateConversations((prev) => [
                                conversation,
                                ...prev,
                            ]);
                            emit('message.created', message);

                            navigate(`/conversation/${conversation.id}`, {
                                replace: true,
                                state: {
                                    initialMessage: message,
                                    skipInitialFetch: true,
                                },
                            });
                        },
                    }
                );
            } catch (err) {
                console.error('Failed to create conversation:', err);
            }
        },
        [sendFirstMessage, otherUser, updateConversations, emit, navigate]
    );

    if (!otherUser) return <div>Loading...</div>;

    // Create a mock conversation object for the header
    const mockConversation: Conversation = {
        id: 0,
        name: otherUser.name,
        type: 'private',
        typeId: otherUser.id,
        avatar: otherUser.avatar ?? '',
        lastMessage: '',
        lastMessageAttachmentCount: 0,
        lastMessageSenderId: 0,
        lastMessageDate: '',
        unreadMessageCount: 0,
    };

    return (
        <>
            <ConversationHeader selectedConversation={mockConversation} />

            <div className='flex-1 bg-secondary/50 overflow-hidden relative flex items-center justify-center'>
                <p className='text-secondary-content text-sm'>
                    Send a message to start the conversation
                </p>
            </div>

            <ConversationInput
                conversation={mockConversation}
                handleSend={handleFirstMessage}
                sending={isCreating}
            />
        </>
    );
};

export default NewPrivateConversation;
