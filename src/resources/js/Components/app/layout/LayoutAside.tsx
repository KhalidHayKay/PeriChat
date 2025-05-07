import ConversationItem from '@/Components/app/conversation/ConversationItem';
import ConversationSearch from '@/Components/app/ConversationSearch';
import useOnlineUsers from '@/context/OnlineUsers';
import { ConversationTypeEnum } from '@/enums/enums';
import { useConversations } from '@/hooks/useConversations';
import { cn } from '@/utils/utils';
import { Button } from '@headlessui/react';
import { PenBox } from 'lucide-react';

const LayoutAside = ({
	data: { user, selectedConversation },
}: {
	data: {
		user: User;
		selectedConversation: Conversation;
	};
}) => {
	const { checkIfUserIsOnline } = useOnlineUsers();
	const { sorted, filter, setFilter, searchText, setSearchText } =
		useConversations();

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
					online={checkIfUserIsOnline(user.id)}
					search={{
						text: searchText,
						set: setSearchText,
					}}
				/>

				<div className='grid grid-cols-3 bg-secondary rounded-full p-2 font-semibold text-secondary-content'>
					<button
						onClick={() => setFilter('all')}
						className={cn(
							'rounded-full py-1.5',
							filter === 'all'
								? 'bg-primary shadow-sm text-periBlue'
								: 'bg-transparent text-primary-content shadow-none'
						)}
					>
						All
					</button>
					<button
						onClick={() => setFilter('private')}
						className={cn(
							'rounded-full py-1.5',
							filter === 'private'
								? 'bg-primary shadow-sm text-periBlue'
								: 'bg-transparent text-primary-content shadow-none'
						)}
					>
						Private
					</button>
					<button
						onClick={() => setFilter('group')}
						className={cn(
							'rounded-full py-1.5',
							filter === 'group'
								? 'bg-primary shadow-sm text-periBlue'
								: 'bg-transparent text-primary-content shadow-none'
						)}
					>
						Group
					</button>
				</div>
			</header>

			<div className='max-h-[calc(100%-135px)] pl-1 mobile:px-5 sm:pl-1 sm:pr-0 overflow-y-auto custom-scrollbar'>
				<div className='flex items-center justify-between mb-3 px-3 mobile:px-5 sm:px-3'>
					<h2 className='text-secondary-content font-semibold ml-1'>
						Messages
					</h2>

					<Button>
						<PenBox className='size-5' />
					</Button>
				</div>
				<div className='space-y-1'>
					{sorted.map((conversation) => (
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
									? checkIfUserIsOnline(conversation.typeId)
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
