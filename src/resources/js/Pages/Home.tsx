import ChatLayout from '@/Layouts/ChatLayout';
import { ChatBubbleLeftIcon } from '@heroicons/react/24/outline';

const Home = () => (
	<div className='size-full flex flex-col gap-y-3 items-center justify-center'>
		<h2 className='text-2xl font-bold'>PeriChat</h2>
		<p className='text-lg'>Select conversation to see messages</p>
		<ChatBubbleLeftIcon className='size-20 mt-5 text-primary-content' />
	</div>
);

Home.layout = (page: React.ReactNode) => <ChatLayout>{page}</ChatLayout>;

export default Home;
