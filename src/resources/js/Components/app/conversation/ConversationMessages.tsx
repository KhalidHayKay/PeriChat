import { cn } from '@/utils/cn';
import { format } from 'date-fns';
import { CheckCheck } from 'lucide-react';
import { useEffect, useRef } from 'react';

const ConversationMessages = ({
	messages,
	selectedConversation,
	user,
}: {
	messages: Message[];
	selectedConversation: Conversation;
	user: User;
}) => {
	const conversationCtrRef = useRef<HTMLDivElement | null>(null);

	useEffect(() => {
		if (conversationCtrRef.current) {
			conversationCtrRef.current.scrollTop =
				conversationCtrRef.current.scrollHeight;
		}
	}, [selectedConversation]);

	return (
		<div
			ref={conversationCtrRef}
			className=' max-h-full px-2 pt-5 space-y-2 overflow-y-auto custom-scrollbar'
		>
			{messages.map((message) => (
				<div
					key={message.id}
					className={cn(
						'chat',
						message.senderId === user.id ? 'chat-end' : 'chat-start'
					)}
				>
					<div
						className={cn(
							'chat-header flex items-center gap-x-1',
							message.senderId === user.id ? 'mr-1' : 'ml-1'
						)}
					>
						{message.groupId && (
							<div className='font-semibold inline'>
								{message.sender.name !== user.name
									? message.sender.name
									: 'You'}
							</div>
						)}
						<time className='text-[0.8rem]'>
							{/* {format(message.createdAt, 'hh:mm aaa')} */}
							{format(message.createdAt, 'MMM dd, hh:mm aaa')}
						</time>
					</div>
					<div
						className={cn(
							'chat-bubble shadow-sm rounded-xl',
							message.senderId === user.id
								? 'bg-periBlue'
								: 'chat-bubble-primary'
						)}
					>
						{message.message}
					</div>
					{!message.groupId && message.senderId === user.id && (
						<div className='chat-footer'>
							<CheckCheck className='size-4 mt-0.5 text-periBlue/70' />
						</div>
					)}
				</div>
			))}
		</div>
	);
};

export default ConversationMessages;
