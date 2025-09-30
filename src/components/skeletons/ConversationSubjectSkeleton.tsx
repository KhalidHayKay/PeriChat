import { Skeleton } from '../ui/skeleton';

const ConversationSubjectsSkeleton = () => {
    return (
        <div className='space-y-2 px-3 h-full'>
            {Array.from({ length: 20 }).map((_, i) => (
                <Skeleton key={i} className='h-16 w-full rounded-lg' />
            ))}
        </div>
    );
};

export default ConversationSubjectsSkeleton;
