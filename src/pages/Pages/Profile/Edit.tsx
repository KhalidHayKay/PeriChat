import ApplicationLogo from '@/Components/ApplicationLogo';
import { PageProps } from '@/types';
import { cn } from '@/utils/utils';
import { UserIcon } from '@heroicons/react/16/solid';
import { Head, Link, usePage } from '@inertiajs/react';
import { ChevronLeft, Menu, SettingsIcon, User, X } from 'lucide-react';
import { useState } from 'react';
import DeleteUserForm from './Partials/DeleteUserForm';
import LogoutButton from './Partials/LogoutButton';
import UpdatePasswordForm from './Partials/UpdatePasswordForm';
import UpdateProfileInformationForm from './Partials/UpdateProfileInformationForm';

export default function Edit({
	mustVerifyEmail,
	status,
}: PageProps<{ mustVerifyEmail: boolean; status?: string }>) {
	const page = usePage();

	const NavItems = [
		{ id: 1, label: 'Profile', icon: UserIcon },
		{ id: 2, label: 'Settings', icon: SettingsIcon },
	];

	const [open, setOpen] = useState(false);

	const active = true;

	return (
		<>
			<Head title='Profile' />

			{/* side nav bar */}
			<div
				className={cn(
					'fixed w-fit sm:min-w-[200px] left-0 top-0 h-screen bg-secondary p-1 sm:p-5 transition-transform',
					open
						? '-translate-x-0 z-20'
						: ' -translate-x-[110%] mobile:-translate-x-0'
				)}
			>
				<div className='h-full py-5 rounded-none mobile:rounded sm:rounded-2xl bg-primary grid grid-rows-[auto,1fr,auto] w-fit justify-center gap-y-5'>
					<ApplicationLogo className='size-[70px]' />

					<nav>
						{NavItems.map((item) => {
							const Icon = item.icon;
							return (
								<Link
									key={item.id}
									href={route(
										`account.${item.label.toLowerCase()}`
									)}
									className={cn(
										'py-2 flex items-center gap-x-2 font-semibold text-secondary-content w-full px-2 sm:px-5',
										page.url.split('/')[1] ===
											item.label.toLowerCase()
											? 'text-periBlue/80 border-r-2 border-periBlue'
											: 'text-secondary-content/70 hover:bg-primary/50'
									)}
								>
									<Icon className='size-5 ' />
									<span>{item.label}</span>
								</Link>
							);
						})}
					</nav>

					{/* Avatar name email and logout */}
					<div className='grid grid-cols-[auto,1fr,auto] gap-x-2 items-center justify-center gap-y-2 px-2 sm:px-5'>
						<div className='size-9 sm:size-11 rounded-full border flex items-center justify-center'>
							<User className='size-[80%]' />
						</div>
						<div>
							<p className='text-periBlue/50 font-semibold mx-w-[800px] w-[80px] sm:mx-w-[100px] sm:md:w-[100px] lg:mx-w-[150px] lg:md:w-[150px] truncate'>
								John Doe
							</p>
							<p className='text-secondary-content text-xs sm:text-sm ml-1 mx-w-[800px] w-[80px] sm:mx-w-[100px] sm:md:w-[100px] lg:mx-w-[150px] lg:md:w-[150px] truncate'>
								john@example.com
							</p>
						</div>
						<LogoutButton className='mobile:hidden' />
					</div>
				</div>
			</div>

			<div className='pr-0 mobile:pr-1 sm:pr-5 lg:pr-10 min-h-screen w-full ml-0 mobile:w-[calc(100vw-175px)] mobile:ml-[160px] sm:w-[calc(100vw-270px)] sm:ml-[250px] lg:w-[calc(100vw-320px)] lg:ml-[300px] bg-secondary'>
				<header className='pt-0 mobile:pt-1 sm:pt-5 pb-1 sticky top-0 z-10 bg-secondary'>
					<div className='w-full bg-periBlue grid grid-cols-[auto,1fr,auto] items-center px-2.5 sm:px-5 py-3 rounded-none mobile:rounded sm:rounded-xl'>
						<Link href={route('home')} className='mr-3'>
							<ChevronLeft className='size-7 text-secondary' />
						</Link>

						<div className='text-primary/90 justify-self-start'>
							<h1 className='text-2xl sm:text-3xl'>Profile</h1>
							<p className='text-sm sm:text-base'>
								Update your profile
							</p>
						</div>

						<button
							onClick={() => setOpen(!open)}
							className='mobile:hidden text-secondary'
						>
							{!open ? <Menu /> : <X />}
						</button>
						<LogoutButton className='max-w-xl hidden mobile:block' />
					</div>
				</header>

				<div className='w-full space-y-1 sm:space-y-5 mt-0 sm:mt-5 pb-5 mobile:pb-20'>
					<div className='bg-primary p-2 sm:p-4 rounded sm:rounded-xl'>
						<UpdateProfileInformationForm
							mustVerifyEmail={mustVerifyEmail}
							status={status}
							className='max-w-xl'
						/>
					</div>
					<div className='bg-primary p-2 sm:p-4 rounded sm:rounded-xl'>
						<UpdatePasswordForm className='max-w-xl' />
					</div>
					<div className='bg-primary p-2 sm:p-4 rounded sm:rounded-xl'>
						<DeleteUserForm className='max-w-xl' />
					</div>
				</div>

				<footer className='w-full h-1 sm:h-5 bg-secondary fixed bottom-0 right-0'></footer>
			</div>
		</>
	);
}
