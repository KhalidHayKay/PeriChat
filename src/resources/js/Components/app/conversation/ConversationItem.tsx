import { cn } from '@/utils/cn';
import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import { Pin } from 'lucide-react';
import Avatar from './Avatar';

const ConversationItem = ({
	conversation,
	online,
	selectedConversation = null,
}: {
	conversation: any;
	online: boolean;
	selectedConversation: number | null;
}) => {
	const page = usePage();
	const user = page.props.auth.user;

	return (
		<Link
			href={
				conversation.is_group
					? route('chat.group', conversation)
					: route('chat.user', conversation)
			}
			preserveState
			className={cn(
				'flex items-center gap-x-3 sm:gap-x-1 py-2 px-3 mobile:px-5 sm:px-3 rounded-md cursor-pointer transition',
				'hover:bg-secondary/90',
				selectedConversation === conversation.id && 'bg-secondary/90'
			)}
		>
			<Avatar
				avatarUrl={''}
				online={online}
				isGroup={conversation.is_group}
			/>
			<div className='flex-1'>
				<div className='flex items-center justify-between'>
					<h1 className='text-lg font-semibold w-fit max-w-[100px] mobile:max-w-[150px] sm:max-w-[110px] truncate'>
						{conversation.name}
					</h1>
					<p className='text-secondary-content text-sm flex items-center'>
						<Pin className='size-4 mr-1' />{' '}
						{format(conversation.last_message_date, 'hh:MM aa')}
					</p>
				</div>
				<div className='flex items-center justify-between'>
					<p className='text-secondary-content max-w-[160px] mobile:max-w-[250px] sm:max-w-[180px] truncate'>
						{conversation.last_message}
					</p>
					<span className='bg-periRed text-white text-sm size-5 rounded-full flex item-center justify-center'>
						2
					</span>
				</div>
			</div>
		</Link>
	);
};

export default ConversationItem;
