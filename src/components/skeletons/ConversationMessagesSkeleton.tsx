import { cn } from '@/lib/utils';
import { Skeleton } from '../ui/skeleton';

const ConversationMessagesSkeleton = () => {
    return (
        <div className='h-full px-2 py-5 space-y-4 overflow-y-hidden'>
            {Array.from({ length: 8 }).map((_, i) => (
                <div
                    key={i}
                    className={cn(
                        'flex',
                        i % 3 === 0 ? 'justify-end' : 'justify-start'
                    )}
                >
                    <div
                        className={cn(
                            'flex flex-col space-y-2 max-w-[70%]',
                            i % 3 === 0 ? 'items-end' : 'items-start'
                        )}
                    >
                        <Skeleton className='h-3 w-20 bg-primary-content/10' />
                        <Skeleton
                            className={cn(
                                'bg-primary-content/10',
                                'h-10 rounded-xl',
                                i % 4 === 0
                                    ? 'w-32'
                                    : i % 4 === 1
                                      ? 'w-48'
                                      : i % 4 === 2
                                        ? 'w-24'
                                        : 'w-40'
                            )}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ConversationMessagesSkeleton;
