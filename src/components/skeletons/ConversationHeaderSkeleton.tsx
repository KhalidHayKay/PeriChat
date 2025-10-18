import { routes } from '@/config/routes';
import { ChevronLeft } from 'lucide-react';
import { Link } from 'react-router';

import { Skeleton } from '../ui/skeleton';

const ConversationHeaderSkeleton = () => {
    return (
        <div className='p-4 flex items-center justify-between'>
            <div className='flex items-center gap-x-2'>
                <Link to={routes.app.home}>
                    <ChevronLeft className='size-6' />
                </Link>
                <Skeleton className='h-10 w-10 rounded-full' />
                <div className='space-y-2'>
                    <Skeleton className='h-5 w-32' />
                    <Skeleton className='h-4 w-20' />
                </div>
            </div>
            <div className='flex gap-x-2'>
                <Skeleton className='size-5 rounded' />
                <Skeleton className='size-5 rounded' />
                <Skeleton className='size-5 rounded' />
            </div>
        </div>
    );
};

export default ConversationHeaderSkeleton;
