import {
    fetchPublicGroups,
    fetchUsersForNewGroup,
} from '@/actions/conversation';
import useOnlineUsers from '@/context/OnlineUsers';
import { cn } from '@/utils/utils';
import { Check, Search, X } from 'lucide-react';
import { useEffect, useState } from 'react';
import Avatar from '../Avatar';

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
    const [loading, setLoading] = useState(false);
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

    const createGroup = () =>
        handler.create({
            name: groupName,
            members: selectedUsers
                .map((id) => groupUsers.find((user) => user.id === id))
                .filter((user): user is User => user !== undefined),
        });

    const filteredUsers = groupUsers.filter((user) =>
        user.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const filteredPublicGroups = publicGroups.filter((group) =>
        group.name.toLowerCase().includes(searchPublicGroups.toLowerCase())
    );

    useEffect(() => {
        setLoading(true);
        Promise.all([fetchPublicGroups(), fetchUsersForNewGroup()])
            .then(([groupData, userData]) => {
                if (groupData) setPublicGroups(groupData);
                if (userData) setGroupUsers(userData);
                setLoading(false);
            })
            .catch((err) => console.error('Error fetching data:', err));
    }, []);

    return (
        <div className='fixed inset-0 bg-black/50 flex items-center justify-center'>
            <div className='bg-primary rounded-lg w-full max-w-md mx-4'>
                <div className='flex items-center justify-between py-2.5 px-4 border-b border-secondary'>
                    <h3 className='font-semibold text-primary-content'>
                        Create Group
                    </h3>
                    <button
                        onClick={closeModal}
                        className='rounded-full p-1 hover:bg-secondary'
                    >
                        <X className='size-5' />
                    </button>
                </div>

                <div className='p-4'>
                    <div className='mb-2'>
                        <input
                            type='text'
                            value={groupName}
                            onChange={(e) => setGroupName(e.target.value)}
                            placeholder='Enter group name'
                            className='w-full px-2 py-1 bg-secondary rounded-md text-primary-content'
                        />
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-secondary-content'>
                            Add Members
                        </label>
                        <div className='relative mb-2'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-content' />
                            <input
                                type='text'
                                placeholder='Search users...'
                                className='w-full pl-10 pr-3 py-1 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content'
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>

                        {selectedUsers.length > 0 && (
                            <div className='flex items-center gap-2 mb-3 overflow-hidden'>
                                <div className='flex items-center gap-2 overflow-hidden'>
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
                                                    className='h-5 w-5 rounded-full hover:bg-periRed/10 flex items-center justify-center'
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
                            {(loading || filteredUsers.length < 1) && (
                                <div className='size-full flex items-center justify-center'>
                                    {loading
                                        ? 'Loading...'
                                        : filteredUsers.length < 1 &&
                                          'Start conversing with users to add them to groups'}
                                </div>
                            )}
                            {filteredUsers.map((user) => (
                                <div
                                    key={user.id}
                                    className={cn(
                                        'flex items-center gap-3 p-2 cursor-pointer',
                                        selectedUsers.includes(user.id)
                                            ? 'bg-periBlue/10'
                                            : 'hover:bg-secondary/80'
                                    )}
                                    onClick={() => toggleUserSelection(user.id)}
                                >
                                    <Avatar
                                        avatarUrl={user.avatar}
                                        online={checkIfUserIsOnline(user.id)}
                                    />
                                    <div className='flex-1'>
                                        <p className='font-medium text-primary-content text-sm'>
                                            {user.name}
                                        </p>
                                    </div>
                                    {selectedUsers.includes(user.id) && (
                                        <div className='w-4 h-4 rounded-full bg-periBlue flex items-center justify-center'>
                                            <Check className='size-3 text-secondary' />
                                        </div>
                                    )}
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='mb-4'>
                        <label className='block text-sm font-medium text-secondary-content mb-1'>
                            Search Public Groups
                        </label>
                        <div className='relative mb-2'>
                            <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 size-4 text-secondary-content' />
                            <input
                                type='text'
                                placeholder='Search public groups...'
                                className='w-full pl-10 pr-3 py-1 bg-secondary rounded-md text-primary-content placeholder:text-secondary-content'
                                value={searchPublicGroups}
                                onChange={(e) =>
                                    setSearchPublicGroups(e.target.value)
                                }
                            />
                        </div>

                        <div className='h-[150px] overflow-y-auto bg-secondary rounded-md'>
                            {loading && (
                                <div className='size-full flex items-center justify-center'>
                                    Loading...
                                </div>
                            )}
                            {filteredPublicGroups.map((group) => (
                                <div
                                    key={group.id}
                                    className='flex items-center justify-between p-2 hover:bg-secondary/80 cursor-pointer'
                                >
                                    <div className='flex items-center gap-x-1'>
                                        <Avatar
                                            avatarUrl={group.avatar}
                                            isGroup
                                        />
                                        <div>
                                            <p className='font-medium text-primary-content text-sm'>
                                                {group.name}
                                            </p>
                                            <p className='text-xs text-secondary-content'>
                                                {group.usersId?.length} members
                                            </p>
                                        </div>
                                    </div>
                                    <button
                                        onClick={() =>
                                            handler.joinPublic(group)
                                        }
                                        className='text-xs bg-periBlue text-white px-2 py-1 rounded'
                                    >
                                        Join
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className='flex justify-end gap-2 mt-4'>
                        <button
                            className='px-4 py-1 border border-secondary rounded-md text-primary-content'
                            onClick={closeModal}
                        >
                            Cancel
                        </button>
                        <button
                            className='px-4 py-1 bg-periBlue hover:bg-periBlue/90 text-white rounded-md disabled:opacity-50'
                            disabled={!groupName || selectedUsers.length === 0}
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
