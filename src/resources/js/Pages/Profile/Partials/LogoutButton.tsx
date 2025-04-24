import DangerButton from '@/Components/DangerButton';
import Modal from '@/Components/Modal';
import SecondaryButton from '@/Components/SecondaryButton';
import { useForm } from '@inertiajs/react';
import { LogOut } from 'lucide-react';
import { FormEventHandler, useState } from 'react';

export default function LogoutButton({
	className = '',
}: {
	className?: string;
}) {
	const [confirmingUserLogout, setConfirmingUserLogout] = useState(false);

	const { post, processing } = useForm({});

	const confirmUserLogout = () => {
		setConfirmingUserLogout(true);
	};

	const logoutUser: FormEventHandler = (e) => {
		e.preventDefault();

		post(route('logout'), {
			preserveScroll: true,
			onSuccess: () => closeModal(),
		});
	};

	const closeModal = () => {
		setConfirmingUserLogout(false);
	};

	return (
		<section className={`space-y-6 ${className}`}>
			<DangerButton
				onClick={confirmUserLogout}
				className='bg-transparent mobile:bg-red-600 p-0 mobile:px-2 mobile:py-1.5'
			>
				<span className='hidden sm:inline'>Logout</span>
				<LogOut className='text-primary-content mobile:text-primary size-4 sm:hidden' />
			</DangerButton>

			<Modal show={confirmingUserLogout} onClose={closeModal}>
				<form onSubmit={logoutUser} className='p-6'>
					<h2 className='text-lg font-medium text-gray-900 dark:text-gray-100'>
						Are you sure you want to logout?
					</h2>

					<div className='mt-6 flex justify-end'>
						<SecondaryButton onClick={closeModal}>
							Cancel
						</SecondaryButton>

						<DangerButton className='ms-3' disabled={processing}>
							Logout
						</DangerButton>
					</div>
				</form>
			</Modal>
		</section>
	);
}
