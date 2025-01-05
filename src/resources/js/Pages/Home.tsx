import ConversationDisplay from '@/Components/app/conversation/ConversationDisplay';
import Authenticated from '@/Layouts/AuthenticatedLayout';
import ChatLayout from '@/Layouts/ChatLayout';

const Home = () => {
	return <ConversationDisplay />;
};

Home.layout = (page: React.ReactNode) => (
	<Authenticated>
		<ChatLayout children={page} />
	</Authenticated>
);

export default Home;
