import { Skeleton } from '@/components/ui/skeleton';

const ConversationInputSkeleton = () => {
    return (
        <div className='flex items-center gap-x-2 p-4'>
            {/* Input box with emoji button + textarea */}
            <div className='flex-1 flex items-center gap-x-5 rounded-full relative'>
                {/* Emoji button */}
                <Skeleton className='size-8 rounded-full' />

                {/* Textarea */}
                <Skeleton className='flex-1 h-10 rounded-full pl-12' />
            </div>

            {/* File upload button */}
            <Skeleton className='size-10 rounded-full' />

            {/* Send button */}
            <Skeleton className='size-10 rounded-full' />
        </div>
    );
};

export default ConversationInputSkeleton;
