import { Button } from '@/components/ui/button';
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { routes } from '@/config/routes';
import { useAuthContext } from '@/contexts/AuthContext';
import useAuth from '@/hooks/useAuth';
import { zodResolver } from '@hookform/resolvers/zod';

import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router';
import * as z from 'zod';

const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .min(1, 'Password is required'),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const [showPassword, setShowPassword] = useState(false);
    const { handleLogin, isLoading, error } = useAuth();
    const { login } = useAuthContext();
    const navigate = useNavigate();

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        const { email, password } = values;

        const result = await handleLogin(email, password);

        if (result.success) {
            login(result.data);
            navigate(routes.app.home);
        }
    };

    return (
        <div className='w-full'>
            {error && (
                <div className='mb-4 text-sm text-center font-medium text-periRed'>
                    {error}
                </div>
            )}

            <Form {...form}>
                <div className='space-y-4'>
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel
                                    htmlFor='email'
                                    className='block text-sm font-medium text-primary-content'
                                >
                                    Email
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        id='email'
                                        type='email'
                                        className='mt-1 block w-full'
                                        autoComplete='username'
                                        autoFocus
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='mt-2 text-sm text-periRed' />
                            </FormItem>
                        )}
                    />

                    <div className='mt-4'>
                        <FormField
                            control={form.control}
                            name='password'
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel
                                        htmlFor='password'
                                        className='block text-sm font-medium text-primary-content'
                                    >
                                        Password
                                    </FormLabel>
                                    <FormControl>
                                        <div className='relative'>
                                            <Input
                                                id='password'
                                                type={
                                                    showPassword
                                                        ? 'text'
                                                        : 'password'
                                                }
                                                className='mt-1 block w-full pr-10'
                                                autoComplete='current-password'
                                                {...field}
                                            />
                                            <button
                                                type='button'
                                                className='absolute right-3 top-1/2 transform -translate-y-1/2 text-secondary-content hover:text-primary-content transition-colors'
                                                onClick={() =>
                                                    setShowPassword(
                                                        !showPassword
                                                    )
                                                }
                                                tabIndex={-1}
                                            >
                                                {showPassword ? (
                                                    <EyeOff className='h-4 w-4' />
                                                ) : (
                                                    <Eye className='h-4 w-4' />
                                                )}
                                            </button>
                                        </div>
                                    </FormControl>
                                    <FormMessage className='mt-2 text-sm text-periRed' />
                                </FormItem>
                            )}
                        />
                    </div>

                    <div className='mt-4 flex flex-col items-center justify-center gap-y-4'>
                        <Link
                            to='#'
                            type='button'
                            className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 transition-colors'
                        >
                            Forgot your password?
                        </Link>

                        {/* Login button */}
                        <Button
                            type='button'
                            onClick={form.handleSubmit(onSubmit)}
                            className='w-full flex items-center justify-center gap-x-2 bg-periBlue hover:bg-periBlue/90 text-white font-medium py-2 px-4 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
                            disabled={isLoading}
                        >
                            {isLoading ? (
                                <>
                                    <div className='animate-spin rounded-full h-4 w-4 border-b-2 border-white'></div>
                                    <span>Logging in...</span>
                                </>
                            ) : (
                                <>
                                    <span>Log in</span>
                                    <ArrowRight className='size-5' />
                                </>
                            )}
                        </Button>

                        {/* Divider */}
                        {/* <div className='relative w-full flex items-center my-2'>
                            <div className='flex-grow border-t border-gray-200'></div>
                            <span className='px-2 text-xs text-secondary-content'>
                                or
                            </span>
                            <div className='flex-grow border-t border-gray-200'></div>
                        </div> */}

                        {/* Google Login Button */}
                        {/* <Button
                            type='button'
                            // onClick={handleGoogleLogin} // <- you wire this
                            className='w-full flex items-center justify-center gap-x-2 border border-gray-300 bg-white hover:bg-gray-50 text-gray-700 font-medium py-2 px-4 rounded-md cursor-pointer focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors'
                        >
                            <img
                                src='https://www.svgrepo.com/show/475656/google-color.svg'
                                alt='Google logo'
                                className='h-5 w-5'
                            />
                            <span>Continue with Google</span>
                        </Button> */}
                    </div>
                </div>
            </Form>

            <div className='mt-4 flex items-center justify-center gap-x-2'>
                <span className='text-sm text-secondary-content'>
                    Don't have an account?
                </span>
                <Link
                    to={routes.app.auth.register}
                    type='button'
                    className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 transition-colors'
                >
                    Register
                </Link>
            </div>
        </div>
    );
}
