import InputError from '@/Components/InputError';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';

export default function ForgotPassword({ status }: { status?: string }) {
	const { data, setData, post, processing, errors } = useForm({
		email: '',
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route('password.email'));
	};

	return (
		<GuestLayout>
			<Head title='Forgot Password' />

			<div className='mb-4 text-sm text-gray-600 dark:text-gray-400'>
				Forgot your password? No problem. <br /> Provide your email
				address and we will email you a password reset link that will
				allow you to choose a new one.
			</div>

			{status && (
				<div className='mb-4 text-sm font-medium text-green-600 dark:text-green-400'>
					{status}
				</div>
			)}

			<form onSubmit={submit}>
				<TextInput
					id='email'
					type='email'
					name='email'
					value={data.email}
					className='mt-1 block w-full'
					isFocused={true}
					onChange={(e) => setData('email', e.target.value)}
				/>

				<InputError message={errors.email} className='mt-2' />

				<div className='mt-4 flex items-center justify-center'>
					<PrimaryButton className='w-full' disabled={processing}>
						Request Reset Link
					</PrimaryButton>
				</div>
			</form>

			<div className='mt-4 flex items-center justify-center gap-x-2'>
				<Link
					href={route('login')}
					className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2'
				>
					Return to Log in page
				</Link>
			</div>
		</GuestLayout>
	);
}
