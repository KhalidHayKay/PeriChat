import { cn } from '@/lib/utils';

export const UserListSkeleton = ({ secondary }: { secondary?: boolean }) => {
    return (
        <div className='space-y-3'>
            {[...Array(5)].map((_, i) => (
                <div
                    key={i}
                    className='flex items-center gap-3 p-3 animate-pulse'
                >
                    <div
                        className={cn(
                            'size-10 rounded-full',
                            secondary ? 'bg-primary/80' : 'bg-secondary'
                        )}
                    />
                    <div className='flex-1'>
                        <div
                            className={cn(
                                'h-4 bg-secondary rounded w-3/4',
                                secondary ? 'bg-primary/80' : 'bg-secondary'
                            )}
                        />
                    </div>
                </div>
            ))}
        </div>
    );
};

export const GroupListSkeleton = () => {
    return (
        <div className='space-y-2'>
            {[...Array(3)].map((_, i) => (
                <div
                    key={i}
                    className='flex items-center justify-between p-2 animate-pulse'
                >
                    <div className='flex items-center gap-2'>
                        <div className='size-10 rounded-full bg-primary/80' />
                        <div>
                            <div className='h-4 bg-primary/80 rounded w-24 mb-1' />
                            <div className='h-3 bg-primary/80 rounded w-16' />
                        </div>
                    </div>
                    <div className='h-7 w-12 bg-primary/80 rounded' />
                </div>
            ))}
        </div>
    );
};

export const ErrorMessage = ({
    message,
    className,
}: {
    message: string;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center p-4 text-center',
                className
            )}
        >
            <p className='text-sm text-red-400'>{message}</p>
        </div>
    );
};

export const EmptyMessage = ({
    message,
    className,
}: {
    message: string;
    className?: string;
}) => {
    return (
        <div
            className={cn(
                'flex items-center justify-center p-4 text-center',
                className
            )}
        >
            <p className='text-sm text-secondary-content'>{message}</p>
        </div>
    );
};
