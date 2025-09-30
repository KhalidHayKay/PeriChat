import { Button } from '../ui/button';

const ConversationMessagesError = ({ error }: { error: string }) => {
    return (
        <div className='h-full flex items-center justify-center p-8'>
            <div className='text-center space-y-4'>
                <p className='text-destructive'>
                    {/* Failed to load messages */}
                    {error}
                </p>
                <Button
                    variant='outline'
                    onClick={() => window.location.reload()}
                    size='sm'
                >
                    Retry
                </Button>
            </div>
        </div>
    );
};

export default ConversationMessagesError;
