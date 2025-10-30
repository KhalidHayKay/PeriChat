import FormatChatDate from '@/actions/format-chat-date';
import { routes } from '@/config/routes';
import { ConversationTypeEnum } from '@/enums/enums';
import { cn } from '@/lib/utils';
import { AlertCircle, CheckCheck, FileIcon } from 'lucide-react';
import { Link } from 'react-router';
import Avatar from '../Avatar';

const ConversationItem = ({
    user,
    conversation,
    online,
    selectedConversation = null,
}: {
    user: User;
    conversation: Conversation;
    online?: boolean;
    selectedConversation: Conversation | null;
}) => {
    const isLastMessageFromUser = conversation.lastMessageSenderId === user.id;
    const lastMessageFailed = conversation.lastMessageStatus === 'failed';

    return (
        <Link
            to={routes.app.conversation(conversation.id)}
            className={cn(
                'flex items-center gap-x-3 sm:gap-x-1 py-2 px-3 mobile:px-5 sm:px-3 rounded-md cursor-pointer transition',
                'hover:bg-secondary/90',
                selectedConversation?.type === conversation.type &&
                    selectedConversation?.typeId === conversation.typeId &&
                    'bg-secondary/90'
            )}
        >
            <Avatar
                avatarUrl={conversation.avatar}
                online={online}
                isGroup={conversation.type === ConversationTypeEnum.GROUP}
            />
            <div className='flex-1'>
                <div className='flex items-center justify-between'>
                    <h1 className='text-lg font-semibold w-fit max-w-[100px] mobile:max-w-[150px] sm:max-w-[110px] truncate'>
                        {conversation.name}
                    </h1>
                    <p className='text-secondary-content text-xs flex items-center'>
                        {FormatChatDate(conversation.lastMessageDate)}
                    </p>
                </div>
                <div className='flex items-center justify-between'>
                    <p className='text-secondary-content max-w-[160px] mobile:max-w-[250px] sm:max-w-[180px] truncate flex items-center'>
                        {conversation.lastMessageAttachmentCount > 0 && (
                            <FileIcon className='mr-1 w-4 h-4 flex-shrink-0' />
                        )}
                        <span className='max-w-full truncate'>
                            {conversation.lastMessage ? (
                                conversation.lastMessage
                            ) : conversation.lastMessageAttachmentCount > 0 ? (
                                <span className='text-sm'>Attachment</span>
                            ) : (
                                'No messages yet'
                            )}
                        </span>
                    </p>
                    {isLastMessageFromUser ? (
                        lastMessageFailed ? (
                            <AlertCircle className='size-4 mt-0.5 text-destructive' />
                        ) : (
                            <CheckCheck className='size-4 mt-0.5 text-secondary-content' />
                        )
                    ) : (
                        conversation.unreadMessageCount !== 0 && (
                            <span className='bg-periRed text-white text-xs size-4 rounded-full flex item-center justify-center'>
                                {conversation.unreadMessageCount}
                            </span>
                        )
                    )}
                </div>
            </div>
        </Link>
    );
};

export default ConversationItem;
