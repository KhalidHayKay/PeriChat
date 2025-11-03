import LayoutAside from '@/components/layout/LayoutAside';
import { useAuthContext } from '@/contexts/AuthContext';
import { useConversationContext } from '@/contexts/ConversationContext';
import { cn } from '@/lib/utils';
import { Outlet, useLocation } from 'react-router';

const ChatLayout = () => {
    const { user } = useAuthContext();
    const { selectedConversation } = useConversationContext();

    const { state } = useLocation();
    const otherUser = state?.otherUser as User | undefined;

    return (
        <div className='bg-secondary'>
            <div
                className={cn(
                    'flex h-dvh sm:p-2 overflow-hidden',
                    selectedConversation || otherUser
                        ? 'gap-x-0 sm:gap-x-2'
                        : 'sm:gap-x-2'
                )}
            >
                <LayoutAside user={user} />

                <main className='flex-1 bg-primary rounded-lg shadow overflow-hidden min-w-0'>
                    <div className='relative h-full flex flex-col divide-y divide-secondary'>
                        <Outlet />
                    </div>
                </main>
            </div>
        </div>
    );
};

export default ChatLayout;
