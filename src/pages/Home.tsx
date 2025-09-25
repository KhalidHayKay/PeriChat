import { useChatContext } from '@/contexts/ChatContext';
import { MessageCircle } from 'lucide-react';

const Home = () => {
    const { conversations, loading } = useChatContext();

    if (loading) {
        return (
            <div className='size-full flex items-center justify-center'>
                <div className='animate-spin h-8 w-8 border-2 border-primary-content border-t-transparent rounded-full' />
            </div>
        );
    }

    return (
        <div className='size-full flex flex-col gap-y-4 items-center justify-center p-8 text-center'>
            <MessageCircle className='size-20 text-muted-foreground' />
            <h2 className='text-2xl font-bold text-foreground'>
                Welcome to PeriChat
            </h2>

            {conversations.length === 0 ? (
                <div className='space-y-2'>
                    <p className='text-lg text-muted-foreground'>
                        No conversations yet
                    </p>
                    <p className='text-sm text-muted-foreground'>
                        Start a new conversation to get started
                    </p>
                </div>
            ) : (
                <p className='text-lg text-muted-foreground'>
                    Select a conversation from the sidebar to start chatting
                </p>
            )}
        </div>
    );
};

export default Home;
