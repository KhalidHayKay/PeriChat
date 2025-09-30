import { RotateCcw } from 'lucide-react';
import { Button } from '../ui/button';

const ConversationSubjectError = ({
    error,
    refresh,
}: {
    error: string;
    refresh: () => void;
}) => {
    return (
        <div className='px-3 py-8 text-center space-y-4'>
            <p className='text-periRed text-sm'>{error}</p>
            <Button
                variant='outline'
                size='icon'
                onClick={refresh}
                className='h-8 w-8 cursor-pointer hover:bg-secondary'
            >
                <RotateCcw className='h-4 w-4' />
            </Button>
        </div>
    );
};

export default ConversationSubjectError;
