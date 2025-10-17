import HomeSkeleton from '@/components/skeletons/HomeSkeleton';
import { useConversationContext } from '@/contexts/ConversationContext';
import { MessageCircle } from 'lucide-react';

const Home = () => {
    const { conversations, loading } = useConversationContext();

    if (loading) return <HomeSkeleton />;

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
