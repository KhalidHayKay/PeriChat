import { routes } from '@/config/routes';

import { Link } from 'react-router';

import { Button } from '../ui/button';

const ConversationNotFoundError = () => {
    return (
        <div className='h-full flex items-center justify-center p-8'>
            <div className='text-center space-y-4'>
                <p className='text-muted-foreground text-lg'>
                    Conversation not found
                </p>
                <Link to={routes.app.home}>
                    <Button variant='secondary'>Back to conversations</Button>
                </Link>
            </div>
        </div>
    );
};

export default ConversationNotFoundError;
