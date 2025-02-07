import Avatar from '@/Components/app/Avatar';
import useOnlineUsers from '@/context/OnlineUsers';
import { ConversationTypeEnum } from '@/enums/ConversationTypeEnum';
import { Link } from '@inertiajs/react';
import { ArrowLeft, EllipsisVertical, Phone, VideoIcon } from 'lucide-react';

const ConversationHeader = ({
	selectedConversation,
}: {
	selectedConversation: Conversation;
}) => {
	const { checkIfUserIsOnline } = useOnlineUsers();

	const isPrivate =
		selectedConversation.type === ConversationTypeEnum.PRIVATE;
	const isOnline = checkIfUserIsOnline(
		isPrivate ? selectedConversation.id : 0
	);

	let onlineGroupUsers = 0;
	selectedConversation.groupUserIds?.forEach((id) => {
		if (checkIfUserIsOnline(id)) onlineGroupUsers++;
		return onlineGroupUsers;
	});

	return (
		<div className='p-4 flex items-center justify-between'>
			<div className='flex items-center gap-x-2'>
				<Link href={'/'} className='sm:hidden mr-2'>
					<ArrowLeft className='size-7' />
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
