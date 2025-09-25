// components/LayoutAside.tsx
import ConversationItem from '@/components/conversation/ConversationItem';
import ConversationSearch from '@/components/ConversationSearch';
import { Button } from '@/components/ui/button'; // shadcn component
import { Skeleton } from '@/components/ui/skeleton'; // shadcn component - install if needed
import { useChatContext } from '@/contexts/ChatContext';
import useOnlineUsers from '@/contexts/OnlineUsers';
import { ConversationTypeEnum } from '@/enums/enums';
import { useConversations } from '@/hooks/useConversations';
import { useMessageSubscriptions } from '@/hooks/useMessageSubscriptions';
import { cn } from '@/lib/utils';
import { RotateCcw } from 'lucide-react';
import NewConversationDropdown from '../new-conversation/NewConversationDropdown';

const LayoutAside = ({ user }: { user: User }) => {
    const { selectedConversation, loading, error, refreshConversations } =
        useChatContext();
    const { checkIfUserIsOnline } = useOnlineUsers();
    const { local, sorted, filter, setFilter, searchText, setSearchText } =
        useConversations();

    useMessageSubscriptions(local, user, selectedConversation);

    return (
        <aside
            className={cn(
                'transition duration-100',
                'h-full w-full sm:w-[300px] md:w-[370px] lg:w-[450px] bg-primary py-4 rounded-lg shadow space-y-5',
                selectedConversation ? '-ml-[100%] sm:-ml-0' : ''
            )}
        >
            <header className='px-4 mobile:px-10 sm:px-4 space-y-5'>
                <ConversationSearch
                    user={user}
                    // online={checkIfUserIsOnline(user.id)}
                    online={false}
                    search={{
                        text: searchText,
                        set: setSearchText,
                    }}
                />

                <div className='grid grid-cols-3 bg-secondary rounded-full p-2 font-semibold text-secondary-content'>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setFilter('all')}
                        className={cn(
                            'rounded-full py-1.5 h-auto cursor-pointer',
                            filter === 'all'
                                ? 'bg-primary shadow-sm text-periBlue hover:bg-primary/90 hover:text-periBlue'
                                : 'bg-transparent text-primary-content shadow-none hover:bg-primary/10'
                        )}
                    >
                        All
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setFilter('private')}
                        className={cn(
                            'rounded-full py-1.5 h-auto cursor-pointer',
                            filter === 'private'
                                ? 'bg-primary shadow-sm text-periBlue hover:bg-primary/90 hover:text-periBlue'
                                : 'bg-transparent text-primary-content shadow-none hover:bg-primary/10'
                        )}
                    >
                        Private
                    </Button>
                    <Button
                        variant='ghost'
                        size='sm'
                        onClick={() => setFilter('group')}
                        className={cn(
                            'rounded-full py-1.5 h-auto cursor-pointer',
                            filter === 'group'
                                ? 'bg-primary shadow-sm text-periBlue hover:bg-primary/90 hover:text-periBlue'
                                : 'bg-transparent text-primary-content shadow-none hover:bg-primary/10'
                        )}
                    >
                        Group
                    </Button>
                </div>
            </header>

            <div
                className={cn(
                    'h-[calc(100%-135px)] pl-1 mobile:px-5 sm:pl-1 sm:pr-0 custom-scrollbar',
                    loading ? 'overflow-y-hidden' : 'overflow-y-auto'
                )}
            >
                <div className='flex items-center justify-between mb-3 px-3 mobile:px-5 sm:px-3'>
                    <h2 className='text-secondary-content font-semibold ml-1'>
                        Messages
                    </h2>

                    <NewConversationDropdown />
                </div>

                <div
                    className={cn(
                        'space-y-1',
                        loading || error || sorted.length < 1
                            ? 'h-[calc(100%-150px)] flex flex-col justify-center'
                            : ''
                    )}
                >
                    {loading && (
                        <div className='space-y-2 px-3 h-full'>
                            {Array.from({ length: 20 }).map((_, i) => (
                                <Skeleton
                                    key={i}
                                    className='h-16 w-full rounded-lg bg-secondary'
                                />
                            ))}
                        </div>
                    )}

                    {error && (
                        <div className='px-3 py-8 text-center space-y-4'>
                            <p className='text-periRed text-sm'>{error}</p>
                            <Button
                                variant='outline'
                                size='icon'
                                onClick={refreshConversations}
                                className='h-8 w-8 cursor-pointer hover:bg-secondary'
                            >
                                <RotateCcw className='h-4 w-4' />
                            </Button>
                        </div>
                    )}

                    {!loading && !error && sorted.length < 1 && (
                        <div className='px-3 py-8 text-center text-muted-foreground text-sm'>
                            You have no existing conversation
                        </div>
                    )}

                    {!loading &&
                        !error &&
                        sorted.map((conversation) => (
                            <ConversationItem
                                key={
                                    `${conversation.type === ConversationTypeEnum.GROUP ? 'group_' : 'user_'}` +
                                    conversation.typeId
                                }
                                user={user}
                                conversation={conversation}
                                online={
                                    conversation.type ===
                                    ConversationTypeEnum.PRIVATE
                                        ? checkIfUserIsOnline(
                                              conversation.typeId
                                          )
                                        : undefined
                                }
                                selectedConversation={selectedConversation}
                            />
                        ))}
                </div>
            </div>
        </aside>
    );
};

export default LayoutAside;
