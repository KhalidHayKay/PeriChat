import { Skeleton } from '../ui/skeleton';

const HomeSkeleton = () => {
    return (
        <div className='size-full flex flex-col items-center justify-center gap-y-4 p-8'>
            <Skeleton className='h-20 w-20 rounded-full' />
            <Skeleton className='h-6 w-48' />
            <div className='space-y-2 flex flex-col items-center'>
                <Skeleton className='h-4 w-64' />
                <Skeleton className='h-4 w-40' />
            </div>
        </div>
    );
};

export default HomeSkeleton;
