import ApplicationLogo from '@/components/ApplicationLogo';
import { Link, Outlet } from 'react-router';

export default function Authlayout() {
    return (
        <div className='flex min-h-screen flex-col items-center bg-primary pt-6 sm:justify-center sm:pt-0'>
            <div className='flex flex-col items-center'>
                <Link to='/' className='flex items-center'>
                    <ApplicationLogo className='size-[90px]' />
                    <h1 className='-ml-[35px] mt-2 text-3xl font-bold text-primary-content'>
                        eriChat
                    </h1>
                </Link>
                <p className='-mt-2 text-secondary-content font-semibold'>
                    Seamless chats. Built for simplicity
                </p>
            </div>

            <div className='mt-6 w-full sm:max-w-md overflow-hidden px-6 py-4 border-secondary border-0 sm:border border-t-0 sm:rounded-lg sm:rounded-tl-none sm:rounded-tr-none'>
                <Outlet />
            </div>
        </div>
    );
}
