import { Button } from '@/components/ui/button';

const GoogleAuth = () => {
    return (
        <>
            <div className='relative w-full flex items-center my-2'>
                <div className='flex-grow border-t border-gray-200'></div>
                <span className='px-2 text-xs text-secondary-content'>or</span>
                <div className='flex-grow border-t border-gray-200'></div>
            </div>

            <Button
                type='button'
                // onClick={handleGoogleSignup}
                className='w-full flex items-center justify-center gap-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
            >
                <img
                    src='https://www.svgrepo.com/show/475656/google-color.svg'
                    alt='Google logo'
                    className='h-5 w-5'
                />
                <span>Sign up with Google</span>
            </Button>
        </>
    );
};

export default GoogleAuth;
