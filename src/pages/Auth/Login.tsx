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
import { zodResolver } from '@hookform/resolvers/zod';
import { ArrowRight, Eye, EyeOff } from 'lucide-react';
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import * as z from 'zod';

// Zod schema for form validation
const loginSchema = z.object({
    email: z
        .email('Please enter a valid email address')
        .min(1, 'Email is required'),
    password: z
        .string()
        .min(6, 'Password must be at least 6 characters')
        .min(1, 'Password is required'),
    remember: z.boolean().optional(),
});

type LoginFormValues = z.infer<typeof loginSchema>;

export default function Login() {
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const [status, setStatus] = useState<string>('success');
    const [apiError, setApiError] = useState<string>('');

    const form = useForm<LoginFormValues>({
        resolver: zodResolver(loginSchema),
        defaultValues: {
            email: '',
            password: '',
            remember: false,
        },
    });

    const onSubmit = async (values: LoginFormValues) => {
        setIsLoading(true);
        setApiError('');
        setStatus('');

        try {
            // Replace this with your actual API call
            const response = await fetch('/api/auth/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Accept: 'application/json',
                },
                body: JSON.stringify({
                    email: values.email,
                    password: values.password,
                    remember: values.remember,
                }),
            });

            const data = await response.json();

            if (!response.ok) {
                // Handle validation errors from backend
                if (data.errors) {
                    // Set field-specific errors
                    Object.entries(data.errors).forEach(([field, messages]) => {
                        if (field === 'email' || field === 'password') {
                            form.setError(field, {
                                type: 'server',
                                message: Array.isArray(messages)
                                    ? messages[0]
                                    : messages,
                            });
                        }
                    });

                    // Set general error if no field-specific errors
                    if (!data.errors.email && !data.errors.password) {
                        setApiError(data.message || 'Login failed');
                    }
                } else {
                    setApiError(data.message || 'Login failed');
                }
                return;
            }

            // Success! Handle the response
            setStatus('Login successful! Redirecting...');

            // Store token if needed
            if (data.token) {
                // Note: In a real app, you'd store this properly
                // localStorage.setItem('auth_token', data.token);
                console.log('Token received:', data.token);
            }

            // Redirect after success
            setTimeout(() => {
                // In a real app: window.location.href = '/dashboard';
                setStatus('Would redirect to dashboard now');
            }, 1500);
        } catch (error) {
            setApiError('Network error. Please try again.');
        } finally {
            setIsLoading(false);
            // Reset password field for security
            form.setValue('password', '');
        }
    };

    return (
        <div className='w-full'>
            {/* Status message - EXACT match to your original */}
            {status && (
                <div className='mb-4 text-sm font-medium text-green-600'>
                    {status}
                </div>
            )}

            {/* API Error message - using your periRed color */}
            {apiError && (
                <div className='mb-4 text-sm font-medium text-periRed'>
                    {apiError}
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
                        <button
                            type='button'
                            className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 transition-colors'
                            onClick={() => {
                                // Handle forgot password navigation
                                console.log('Navigate to forgot password');
                            }}
                        >
                            Forgot your password?
                        </button>

                        <Button
                            type='button'
                            onClick={form.handleSubmit(onSubmit)}
                            className='w-full flex items-center justify-center gap-x-2 bg-periBlue hover:bg-periBlue/90 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors'
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
                    </div>
                </div>
            </Form>

            <div className='mt-4 flex items-center justify-center gap-x-2'>
                <span className='text-sm text-secondary-content'>
                    Don't have an account?
                </span>
                <button
                    type='button'
                    className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2 transition-colors'
                    onClick={() => {
                        // Handle register navigation
                        console.log('Navigate to register');
                    }}
                >
                    Register
                </button>
            </div>
        </div>
    );
}
