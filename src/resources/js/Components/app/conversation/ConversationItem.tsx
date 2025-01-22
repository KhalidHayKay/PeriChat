import FormatChatDate from '@/actions/format-chat-date';
import { cn } from '@/utils/cn';
import { Link } from '@inertiajs/react';
import Avatar from '../Avatar';

const ConversationItem = ({
	conversation,
	online,
	selectedConversation = null,
}: {
	conversation: Conversation;
	online?: boolean;
	selectedConversation: Conversation | null;
}) => {
	return (
		<Link
			href={
				conversation.type === 'group'
					? route('conversation.group', conversation as any)
					: route('conversation.private', conversation as any)
			}
			preserveState
			className={cn(
				'flex items-center gap-x-3 sm:gap-x-1 py-2 px-3 mobile:px-5 sm:px-3 rounded-md cursor-pointer transition',
				'hover:bg-secondary/90',
				selectedConversation?.type === conversation.type &&
					selectedConversation?.id === conversation.id &&
					'bg-secondary/90'
			)}
		>
			<Avatar
				avatarUrl={conversation.avatar}
				online={online}
				isGroup={conversation.type === 'group'}
			/>
			<div className='flex-1'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-semibold w-fit max-w-[100px] mobile:max-w-[150px] sm:max-w-[110px] truncate'>
						{conversation.name}
					</h1>
					<p className='text-secondary-content text-xs flex items-center'>
						{/* <Pin className='size-4 mr-1' />{' '} */}
						{conversation.lastMessageDate
							? FormatChatDate(conversation.lastMessageDate)
							: ''}
					</p>
				</div>
				<div className='flex items-center justify-between'>
					<p className='text-secondary-content max-w-[160px] mobile:max-w-[250px] sm:max-w-[180px] truncate'>
						{conversation.lastMessage ?? 'No message'}
					</p>
					<span className='bg-periRed text-white text-xs size-4 rounded-full flex item-center justify-center'>
						2
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ConversationItem;
