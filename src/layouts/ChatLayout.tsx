import LayoutAside from '@/components/layout/LayoutAside';
import { useAuthContext } from '@/contexts/AuthContext';
import { useChatContext } from '@/contexts/ChatContext'; // You'll need this
import { cn } from '@/lib/utils';
import { Outlet } from 'react-router';

const ChatLayout = () => {
    const { user } = useAuthContext();
    const { selectedConversation } = useChatContext();

    return (
        <div className='min-h-screen bg-secondary'>
            <div
                className={cn(
                    'flex h-screen sm:p-2 overflow-hidden',
                    !!selectedConversation ? 'gap-x-0 sm:gap-x-2' : 'gap-x-2'
                )}
            >
                <LayoutAside user={user} />

                <main className='flex-1 bg-primary rounded-lg shadow overflow-hidden min-w-0'>
                    <div className='relative h-full flex flex-col divide-y divide-secondary'>
                        <Outlet context={{ selectedConversation, user }} />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatLayout;
