import { createPrivateConversation } from '@/actions/conversation';
import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import useAppEventContext from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const NewPrivateConversation = () => {
    const navigate = useNavigate();
    // const { user } = useAuthContext();
    const { updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();
    const [isCreating, setIsCreating] = useState(false);
    const [_error, setError] = useState<string | null>(null);

    const { state } = useLocation();
    const otherUser = state?.otherUser;

    if (!otherUser) {
        navigate('/');
        return null;
    }

    const handleFirstMessage = async (content: string, files: Attachment[]) => {
        if (isCreating) return;

        setIsCreating(true);
        setError(null);

        try {
            const reqMessage = {
                message: content,
                attachments: files,
            };
            const { conversation, message } = await createPrivateConversation(
                Number(otherUser.id),
                reqMessage
            );

            updateConversations((prev) => [conversation, ...prev]);

            emit('message.created', message);

            navigate(`/conversation/${conversation.id}`, {
                replace: true,
            });
        } catch (err) {
            setError(
                err instanceof Error
                    ? err.message
                    : 'Failed to create conversation'
            );
            setIsCreating(false);
        }
    };

    if (!otherUser) return <div>Loading...</div>;

    // Create a mock conversation object for the header
    const mockConversation: Conversation = {
        id: 0,
        name: otherUser.name,
        type: 'private',
        typeId: otherUser.id,
        avatar: otherUser.avatar,
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
                hanldeSend={handleFirstMessage}
                sending={isCreating}
            />
        </>
    );
};

export default NewPrivateConversation;
