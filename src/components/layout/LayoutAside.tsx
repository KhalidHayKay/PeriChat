import ConversationItem from '@/components/conversation/ConversationItem';
import ConversationSearch from '@/components/ConversationSearch';
import { Button } from '@/components/ui/button';
import { useConversationContext } from '@/contexts/ConversationContext';
import { useOnlineUsers } from '@/contexts/OnlineUsersContext';
import { ConversationTypeEnum } from '@/enums/enums';
import { useConversations } from '@/hooks/useConversations';
import { useMessageSubscriptions } from '@/hooks/useMessageSubscriptions';
import { capitalize, cn } from '@/lib/utils';
import ConversationSubjectError from '../errors/ConversationSubjectsError';
import NewConversationDropdown from '../new-conversation/NewConversationDropdown';
import ConversationSubjectsSkeleton from '../skeletons/ConversationSubjectSkeleton';

type filterType = 'all' | 'private' | 'group';

const LayoutAside = ({ user }: { user: User }) => {
    const { checkIfUserIsOnline } = useOnlineUsers();
    const {
        hasConversationId,
        selectedConversation,
        loading,
        error,
        refreshConversations,
    } = useConversationContext();
    const { sorted, filter, setFilter, searchText, setSearchText } =
        useConversations();

    useMessageSubscriptions(user);

    const FilterButton = ({ filterValue }: { filterValue: filterType }) => (
        <Button
            variant='ghost'
            size='sm'
            onClick={() => setFilter(filterValue)}
            className={cn(
                'rounded-full py-1.5 h-auto cursor-pointer',
                filter === filterValue
                    ? 'bg-primary shadow-sm text-periBlue hover:bg-primary/90 hover:text-periBlue'
                    : 'bg-transparent text-primary-content shadow-none hover:bg-primary/10'
            )}
        >
            {capitalize(filterValue)}
        </Button>
    );

    return (
        <aside
            className={cn(
                'transition duration-100',
                'h-full w-full sm:w-[300px] md:w-[370px] lg:w-[450px] bg-primary py-4 rounded-lg shadow space-y-5',
                hasConversationId ? '-ml-[100%] sm:-ml-0' : ''
            )}
        >
            <header className='px-4 mobile:px-10 sm:px-4 space-y-5'>
                <ConversationSearch
                    user={user}
                    online={checkIfUserIsOnline(user.id)}
                    search={{
                        text: searchText,
                        set: setSearchText,
                    }}
                />

                <div className='grid grid-cols-3 bg-secondary rounded-full p-2 font-semibold text-secondary-content'>
                    {(['all', 'private', 'group'] as filterType[]).map((f) => (
                        <FilterButton key={f} filterValue={f} />
                    ))}
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
                    {loading ? (
                        <ConversationSubjectsSkeleton />
                    ) : error ? (
                        <ConversationSubjectError
                            error={error}
                            refresh={refreshConversations}
                        />
                    ) : sorted.length < 1 ? (
                        <div className='px-3 py-8 text-center text-muted-foreground text-sm'>
                            You have no existing conversation
                        </div>
                    ) : (
                        sorted.map((conversation) => (
                            <ConversationItem
                                key={`${conversation.type === ConversationTypeEnum.GROUP ? 'group_' : 'user_'}${conversation.typeId}`}
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
                        ))
                    )}
                </div>
            </div>
        </aside>
    );
};

export default LayoutAside;
