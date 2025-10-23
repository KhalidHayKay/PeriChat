import { fetchAppUsers } from '@/actions/conversation';
import Avatar from '@/components/Avatar';
import { useOnlineUsers } from '@/contexts/OnlineUsersContext';
import usePreventScrollPropagation from '@/hooks/usePreventScrollPropagation';
import { Plus, Search } from 'lucide-react';
import { useEffect, useRef, useState, type RefObject } from 'react';
import { ErrorMessage, UserListSkeleton } from './SkeletonComponents';

const UserList = ({
    searchTerm,
    openGroupModal,
    handleUserClick,
}: {
    searchTerm: { value: string; set: (term: string) => void };
    openGroupModal: () => void;
    handleUserClick: (otherUser: User) => void;
}) => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const { checkIfUserIsOnline } = useOnlineUsers();

    const scrollContainerRef = useRef<HTMLDivElement>(null);

    usePreventScrollPropagation(
        scrollContainerRef as RefObject<HTMLDivElement>
    );

    useEffect(() => {
        const loadUsers = async () => {
            try {
                setLoading(true);
                setError(null);
                const data = await fetchAppUsers();
                setUsers(data || []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load users'
                );
                console.error('Error loading users:', err);
            } finally {
                setLoading(false);
            }
        };

        loadUsers();
    }, []);

    const filteredUsers = users.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.value.toLowerCase())
    );

    return (
        <div className='absolute right-0 top-full w-72 bg-primary rounded-lg shadow-lg z-10 overflow-hidden'>
            <div className='py-2 px-3 border-b border-secondary'>
                <button
                    onClick={openGroupModal}
                    className='w-full flex items-center justify-start text-sm py-1.5 px-2 rounded-md bg-periBlue hover:bg-periBlue/90 text-white transition-colors'
                >
                    <Plus className='mr-2 size-4' />
                    Group
                </button>
            </div>

            <div className='py-2 px-3 border-b border-secondary'>
                <div className='relative'>
                    <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-content' />
                    <input
                        type='text'
                        placeholder='Search users'
                        className='w-full pl-10 pr-3 py-1 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content'
                        value={searchTerm.value}
                        onChange={(e) => searchTerm.set(e.target.value)}
                    />
                </div>
            </div>

            <div className='h-[300px] overflow-y-auto' ref={scrollContainerRef}>
                {loading ? (
                    <UserListSkeleton />
                ) : error ? (
                    <ErrorMessage message={error} className='h-full' />
                ) : filteredUsers.length === 0 ? (
                    <ErrorMessage
                        message={
                            searchTerm.value
                                ? 'No users found'
                                : 'No users available'
                        }
                        className='h-full'
                    />
                ) : (
                    filteredUsers.map((user) => (
                        <div
                            key={user.id}
                            className='flex items-center gap-3 p-3 hover:bg-secondary cursor-pointer transition-colors'
                            onClick={() => handleUserClick(user)}
                        >
                            <Avatar
                                avatarUrl={user.avatar}
                                online={checkIfUserIsOnline(user.id)}
                            />
                            <div>
                                <p className='font-medium text-primary-content'>
                                    {user.name}
                                </p>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default UserList;
