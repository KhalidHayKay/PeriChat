import Checkbox from '@/Components/Checkbox';
import InputError from '@/Components/InputError';
import InputLabel from '@/Components/InputLabel';
import PrimaryButton from '@/Components/PrimaryButton';
import TextInput from '@/Components/TextInput';
import GuestLayout from '@/layouts/AuthLayout';
import { Head, Link, useForm } from '@inertiajs/react';
import { ArrowRight } from 'lucide-react';
import { FormEventHandler } from 'react';

export default function Register() {
	const { data, setData, post, processing, errors, reset } = useForm({
		name: '',
		email: '',
		password: '',
		password_confirmation: '',
	});

	const submit: FormEventHandler = (e) => {
		e.preventDefault();

		post(route('register'), {
			onFinish: () => reset('password', 'password_confirmation'),
		});
	};

	return (
		<GuestLayout>
			<Head title='Register' />

			<form onSubmit={submit}>
				<div>
					<InputLabel htmlFor='name' value='Name' />

					<TextInput
						id='name'
						name='name'
						value={data.name}
						className='mt-1 block w-full'
						autoComplete='name'
						isFocused={true}
						onChange={(e) => setData('name', e.target.value)}
						required
					/>

					<InputError message={errors.name} className='mt-2' />
				</div>

				<div className='mt-4'>
					<InputLabel htmlFor='email' value='Email' />

					<TextInput
						id='email'
						type='email'
						name='email'
						value={data.email}
						className='mt-1 block w-full'
						autoComplete='username'
						onChange={(e) => setData('email', e.target.value)}
						required
					/>

					<InputError message={errors.email} className='mt-2' />
				</div>

				<div className='mt-4'>
					<InputLabel htmlFor='password' value='Password' />

					<TextInput
						id='password'
						type='password'
						name='password'
						value={data.password}
						className='mt-1 block w-full'
						autoComplete='new-password'
						onChange={(e) => setData('password', e.target.value)}
						required
					/>

					<InputError message={errors.password} className='mt-2' />
				</div>

				<div className='mt-4'>
					<InputLabel
						htmlFor='password_confirmation'
						value='Confirm Password'
					/>

					<TextInput
						id='password_confirmation'
						type='password'
						name='password_confirmation'
						value={data.password_confirmation}
						className='mt-1 block w-full'
						autoComplete='new-password'
						onChange={(e) =>
							setData('password_confirmation', e.target.value)
						}
						required
					/>

					<InputError
						message={errors.password_confirmation}
						className='mt-2'
					/>
				</div>

				<div className='mt-4 flex flex-col justify-center gap-y-4'>
					<label className='flex items-center'>
						<Checkbox
							name='remember'
							// checked={data.remember}
							// onChange={(e) =>
							//   setData('remember', e.target.checked)
							// }
						/>
						<span className='ml-2 text-xs'>
							I accept the{' '}
							<Link
								href={'#'}
								target='_blank'
								className='text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2'
							>
								Terms of Service
							</Link>{' '}
							and{' '}
							<Link
								href={'#'}
								target='_blank'
								className='text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2'
							>
								Privacy Policy
							</Link>
						</span>
					</label>

					<PrimaryButton
						className='w-full flex items-center justify-center gap-x-2'
						disabled={processing}
					>
						<span>Register</span>
						<ArrowRight className='size-5' />
					</PrimaryButton>
				</div>
			</form>

			<div className='mt-4 flex items-center justify-center gap-x-2'>
				<span className='text-sm text-secondary-content'>
					Already have an account?
				</span>
				<Link
					href={route('login')}
					className='rounded-md text-sm text-secondary-content underline hover:text-primary-content focus:outline-none focus:ring-2 focus:ring-periBlue/80 focus:ring-offset-2'
				>
					Log in
				</Link>
			</div>
		</GuestLayout>
	);
}
