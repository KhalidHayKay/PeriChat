import { Input } from '@headlessui/react';
import { Plus, Send, Smile } from 'lucide-react';

const ConversationInput = () => {
	return (
		<div className='flex items-center gap-x-2 p-4'>
			<div className='flex-1 bg-secondary relative rounded-full'>
				<Smile className='absolute left-3 top-1/2 -translate-y-1/2 size-5 cursor-pointer' />
				<Input
					className='bg-transparent h-fit w-[90%] border-none focus:ring-0 float-right'
					placeholder='Write a message'
				/>
			</div>
			<div className='size-10 flex items-center justify-center border border-secondary-content rounded-full cursor-pointer'>
				<Plus className='size-4' />
			</div>
			<div className='size-10 flex items-center justify-center bg-periBlue rounded-full cursor-pointer'>
				<Send className='size-4 text-primary' />
			</div>
		</div>
	);
};

export default ConversationInput;
