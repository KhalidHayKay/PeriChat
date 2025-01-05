import { Input } from '@headlessui/react';
import {
	EllipsisVertical,
	Phone,
	Plus,
	Send,
	Smile,
	UserCircle2Icon,
	VideoIcon,
} from 'lucide-react';

const ConversationDisplay = () => {
	return (
		<div className='size-full flex flex-col divide-y divide-secondary'>
			<div className='p-4 flex items-center justify-between'>
				<div className='flex items-center gap-x-2'>
					<div className='relative rounded-full size-10 flex items-center justify-center cursor-pointer'>
						<UserCircle2Icon className='size-full' />
					</div>
					<div className='cursor-pointer'>
						<h1 className='text-lg font-semibold'>Jonathan</h1>
						<p className='text-secondary-content text-sm ml-0.5'>
							online
						</p>
					</div>
				</div>
				<div className='flex gap-x-2 text-primary-content'>
					<VideoIcon className='size-5 cursor-pointer' />
					<Phone className='size-5 cursor-pointer' />
					<EllipsisVertical className='size-5 cursor-pointer' />
				</div>
			</div>

			<div className='flex-1 bg-secondary/30'>Hello world</div>

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
		</div>
	);
};

export default ConversationDisplay;
