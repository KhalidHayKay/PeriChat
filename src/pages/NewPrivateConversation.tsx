import ConversationHeader from '@/components/conversation/ConversationHeader';
import ConversationInput from '@/components/conversation/ConversationInput';
import { Button } from '@/components/ui/button';
import useAppEventContext from '@/contexts/AppEventsContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useSendMessage } from '@/hooks/useSendMessage';
import { X } from 'lucide-react';
import { useCallback, useState } from 'react';
import { useLocation, useNavigate } from 'react-router';

const NewPrivateConversation = () => {
    const { updateConversations } = useConversationContext();
    const { emit } = useAppEventContext();
    const { sendFirstMessage } = useSendMessage();
    const [error, setError] = useState<string | null>(null);
    const navigate = useNavigate();
    const { state } = useLocation();
    const otherUser = state?.otherUser as User | undefined;

    if (!otherUser) {
        navigate('/');
        return null;
    }

    const handleFirstMessage = useCallback(
        async (content: string, files: Attachment[]) => {
            setError(null);

            try {
                await sendFirstMessage(content, files, Number(otherUser.id), {
                    onSuccess: (conversation, message) => {
                        updateConversations((prev) => [conversation, ...prev]);
                        emit('message.created', message);

                        navigate(`/conversation/${conversation.id}`, {
                            replace: true,
                            state: {
                                initialMessage: message,
                                skipInitialFetch: true,
                            },
                        });
                    },
                    onError: (err) => {
                        setError(err.message);
                    },
                });
            } catch (err) {
                // Error already handled in onError callback
                console.error('Failed to create conversation:', err);
            }
        },
        [sendFirstMessage, otherUser, updateConversations, emit, navigate]
    );

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
                {error ? (
                    <div className='text-center flex flex-col items-center gap-y-2 px-4'>
                        <p className='text-destructive text-sm'>{error}</p>
                        <Button
                            size='sm'
                            // variant='null'
                            onClick={() => setError(null)}
                            className='text-xs rounded-full bg-destructive/10 hover:bg-destructive/20 text-destructive size-7 flex items-center'
                        >
                            <X />
                        </Button>
                    </div>
                ) : (
                    <p className='text-secondary-content text-sm'>
                        Send a message to start the conversation
                    </p>
                )}
            </div>

            <ConversationInput
                conversation={mockConversation}
                handleSend={handleFirstMessage}
            />
        </>
    );
};

export default NewPrivateConversation;
