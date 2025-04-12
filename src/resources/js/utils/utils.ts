import { clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export const cn = (...inputs: (string | undefined | null | boolean)[]) => {
	return twMerge(clsx(inputs));
};

export const capitalize = (str: string) =>
	str.charAt(0).toUpperCase() + str.slice(1);
