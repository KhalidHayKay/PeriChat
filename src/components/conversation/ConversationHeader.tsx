import Avatar from '@/components/Avatar';
import { routes } from '@/config/routes';
import { useOnlineUsers } from '@/contexts/OnlineUsersContext';
import { ConversationTypeEnum } from '@/enums/enums';
import { ChevronLeft, EllipsisVertical, Phone, VideoIcon } from 'lucide-react';

import { Link } from 'react-router';

const ConversationHeader = ({
    selectedConversation,
}: {
    selectedConversation: Conversation;
}) => {
    const { checkIfUserIsOnline } = useOnlineUsers();

    const isPrivate =
        selectedConversation.type === ConversationTypeEnum.PRIVATE;
    const isOnline = checkIfUserIsOnline(
        isPrivate ? selectedConversation.typeId : 0
    );

    let onlineGroupUsers = 0;
    selectedConversation.groupUsersId?.forEach((id) => {
        if (checkIfUserIsOnline(id)) onlineGroupUsers++;
        return onlineGroupUsers;
    });

    return (
        <div className='max-sm:fixed max-sm:w-full max-sm:top-0 p-4 flex items-center justify-between z-5 bg-primary'>
            <div className='flex items-center gap-x-2'>
                <Link to={routes.app.home}>
                    <ChevronLeft className='size-6' />
                </Link>
                <Avatar
                    avatarUrl={selectedConversation.avatar}
                    isGroup={
                        selectedConversation.type === ConversationTypeEnum.GROUP
                    }
                />
                <div className='cursor-pointer'>
                    <h1 className='text-lg font-semibold'>
                        {selectedConversation.name}
                    </h1>
                    <p className='text-secondary-content text-sm ml-0.5'>
                        {!isPrivate
                            ? (onlineGroupUsers > 0
                                  ? onlineGroupUsers - 1
                                  : 0) + ' active'
                            : isOnline
                              ? 'online'
                              : 'offline'}
                    </p>
                </div>
            </div>
            <div className='flex gap-x-2 text-primary-content'>
                <VideoIcon className='size-5 cursor-pointer' />
                <Phone className='size-5 cursor-pointer' />
                <EllipsisVertical className='size-5 cursor-pointer' />
            </div>
        </div>
    );
};

export default ConversationHeader;
