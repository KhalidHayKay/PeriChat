import {
    fetchPublicGroups,
    fetchUsersForNewGroup,
} from '@/actions/conversation';
import Avatar from '@/components/Avatar';
import { useOnlineUsers } from '@/contexts/OnlineUsersContext';
import { cn } from '@/lib/utils';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import {
    EmptyMessage,
    ErrorMessage,
    GroupListSkeleton,
    UserListSkeleton,
} from './SkeletonComponents';

const CreateGroupModal = ({
    handler,
    closeModal,
}: {
    handler: {
        create: (data: { name: string; members: User[] }) => void;
        joinPublic: (group: Group) => void;
    };
    closeModal: () => void;
}) => {
    const [publicGroups, setPublicGroups] = useState<Group[]>([]);
    const [groupUsers, setGroupUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
    const [groupName, setGroupName] = useState('');
    const [selectedUsers, setSelectedUsers] = useState<number[]>([]);
    const [searchTerm, setSearchTerm] = useState('');
    const [searchPublicGroups, setSearchPublicGroups] = useState('');

    const { checkIfUserIsOnline } = useOnlineUsers();

    const toggleUserSelection = (userId: number) => {
        if (selectedUsers.includes(userId)) {
            setSelectedUsers(selectedUsers.filter((id) => id !== userId));
        } else {
            setSelectedUsers([...selectedUsers, userId]);
        }
    };

    const createGroup = () => {
        if (!groupName.trim() || selectedUsers.length === 0) return;

        handler.create({
            name: groupName.trim(),
            members: selectedUsers
                .map((id) => groupUsers.find((user) => user.id === id))
                .filter((user): user is User => user !== undefined),
        });
    };

    const filteredUsers = groupUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPublicGroups = publicGroups.filter((group) =>
        group.name.toLowerCase().includes(searchPublicGroups.toLowerCase())
    );

    useEffect(() => {
        const loadData = async () => {
            try {
                setLoading(true);
                setError(null);
                const [groupData, userData] = await Promise.all([
                    fetchPublicGroups(),
                    fetchUsersForNewGroup(),
                ]);

                setPublicGroups(groupData || []);
                setGroupUsers(userData || []);
            } catch (err) {
                setError(
                    err instanceof Error ? err.message : 'Failed to load data'
                );
                console.error('Error fetching data:', err);
            } finally {
                setLoading(false);
            }
        };

        loadData();
    }, []);

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center z-50'>
            <div className='bg-primary rounded-lg w-full max-w-md mx-4 max-h-[90vh] flex flex-col'>
                <div className='flex items-center justify-between py-2.5 px-4 border-b border-secondary'>
                    <h3 className='font-semibold text-primary-content'>
                        Create Group
                    </h3>
                    <button
                        onClick={closeModal}
                        className='rounded-full p-1 hover:bg-secondary transition-colors'
                    >
                        <X className='size-5' />
                    </button>
                </div>

                <div className='p-4 overflow-y-auto'>
                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-secondary-content mb-1'>
                            Group Name
                        </label>
                        <input
                            type='text'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder='Enter group name'
                            className='w-full px-3 py-2 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content focus:outline-none focus:ring-2 focus:ring-periBlue'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-secondary-content mb-1'>
                            Add Members
                        </label>
                        <div className='relative mb-2'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-content' />
                            <input
                                type='text'
                                placeholder='Search users'
                                className='w-full pl-10 pr-3 py-2 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content focus:outline-none focus:ring-2 focus:ring-periBlue'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className='flex items-center gap-2 mb-3 overflow-hidden'>
                                <div className='flex items-center gap-2 overflow-x-auto'>
                                    {selectedUsers.slice(0, 3).map((id) => {
                                        const user = groupUsers.find(
                                            (u) => u.id === id
                                        );
                                        return (
                                            <div
                                                key={id}
                                                className='flex-shrink-0 flex items-center bg-secondary rounded-full pl-2 pr-1 py-1'
                                            >
                                                <span className='text-sm text-primary-content mr-1 truncate max-w-[100px]'>
                                                    {user?.name}
                                                </span>
                                                <button
                                                    className='h-5 w-5 rounded-full hover:bg-periRed/10 flex items-center justify-center transition-colors'
                                                    onClick={(e) => {
                                                        e.stopPropagation();
                                                        toggleUserSelection(id);
                                                    }}
                                                >
                                                    <X className='size-3 text-periRed' />
                                                </button>
                                            </div>
                                        );
                                    })}
                                </div>
                                {selectedUsers.length > 3 && (
                                    <div className='flex-shrink-0 bg-secondary rounded-full px-2 py-1'>
                                        <span className='text-sm text-primary-content'>
                                            +{selectedUsers.length - 3}
                                        </span>
                                    </div>
                                )}
                            </div>
                        )}

                        <div className='h-[150px] overflow-y-auto bg-secondary rounded-md'>
                            {loading ? (
                                <UserListSkeleton secondary />
                            ) : error ? (
                                <ErrorMessage
                                    message={error}
                                    className='h-full'
                                />
                            ) : filteredUsers.length === 0 ? (
                                <EmptyMessage
                                    message={
                                        searchTerm
                                            ? 'No users found'
                                            : 'Start conversing with users to add them to groups'
                                    }
                                    className='h-full'
                                />
                            ) : (
                                filteredUsers.map((user) => (
                                    <div
                                        key={user.id}
                                        className={cn(
                                            'flex items-center gap-3 p-2 cursor-pointer transition-colors',
                                            selectedUsers.includes(user.id)
                                                ? 'bg-periBlue/10'
                                                : 'hover:bg-secondary/80'
                                        )}
                                        onClick={() =>
                                            toggleUserSelection(user.id)
                                        }
                                    >
                                        <Avatar
                                            avatarUrl={user.avatar}
                                            online={checkIfUserIsOnline(
                                                user.id
                                            )}
                                        />
                                        <div className='flex-1'>
                                            <p className='font-medium text-primary-content text-sm'>
                                                {user.name}
                                            </p>
                                        </div>
                                        {selectedUsers.includes(user.id) && (
                                            <div className='w-4 h-4 rounded-full bg-periBlue flex items-center justify-center'>
                                                <Check className='size-3 text-white' />
                                            </div>
                                        )}
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-secondary-content mb-1'>
                            Join Public Groups
                        </label>
                        <div className='relative mb-2'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-content' />
                            <input
                                type='text'
                                placeholder='Search public groups'
                                className='w-full pl-10 pr-3 py-2 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content focus:outline-none focus:ring-2 focus:ring-periBlue'
                                value={searchPublicGroups}
                                onChange={(e) =>
                                    setSearchPublicGroups(e.target.value)
                                }
                            />
                        </div>

                        <div className='h-[150px] overflow-y-auto bg-secondary rounded-md'>
                            {loading ? (
                                <GroupListSkeleton />
                            ) : error ? (
                                <ErrorMessage
                                    message={error}
                                    className='h-full'
                                />
                            ) : filteredPublicGroups.length === 0 ? (
                                <EmptyMessage
                                    message={
                                        searchPublicGroups
                                            ? 'No groups found'
                                            : 'No public groups available'
                                    }
                                    className='h-full'
                                />
                            ) : (
                                filteredPublicGroups.map((group) => (
                                    <div
                                        key={group.id}
                                        className='flex items-center justify-between p-2 hover:bg-secondary/80 cursor-pointer transition-colors'
                                    >
                                        <div className='flex items-center gap-2'>
                                            <Avatar
                                                avatarUrl={group.avatar}
                                                isGroup
                                            />
                                            <div>
                                                <p className='font-medium text-primary-content text-sm'>
                                                    {group.name}
                                                </p>
                                                <p className='text-xs text-secondary-content'>
                                                    {group.usersId?.length || 0}{' '}
                                                    members
                                                </p>
                                            </div>
                                        </div>
                                        <button
                                            onClick={() =>
                                                handler.joinPublic(group)
                                            }
                                            className='text-xs bg-periBlue hover:bg-periBlue/90 text-white px-3 py-1.5 rounded transition-colors'
                                        >
                                            Join
                                        </button>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 mt-4 pt-4 border-t border-secondary'>
                        <button
                            className='px-4 py-2 border border-secondary rounded-md text-primary-content hover:bg-secondary transition-colors'
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-2 bg-periBlue hover:bg-periBlue/90 text-white rounded-md disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            disabled={
                                !groupName.trim() || selectedUsers.length === 0
                            }
                            onClick={createGroup}
                        >
                            Create Group
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default CreateGroupModal;
