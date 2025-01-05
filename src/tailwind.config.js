import forms from '@tailwindcss/forms';
import defaultTheme from 'tailwindcss/defaultTheme';

/** @type {import('tailwindcss').Config} */
export default {
	content: [
		'./vendor/laravel/framework/src/Illuminate/Pagination/resources/views/*.blade.php',
		'./storage/framework/views/*.php',
		'./resources/views/**/*.blade.php',
		'./resources/js/**/*.tsx',
	],

	theme: {
		extend: {
			fontFamily: {
				sans: ['Figtree', ...defaultTheme.fontFamily.sans],
			},
			colors: {
				periGreen: '#32cd32',
				periBlue: '#0084ff',
				periRed: '#ff4d4d',
			},
			screens: {
				mobile: '420px',
			},
		},
	},
	plugins: [forms, require('daisyui')],
	daisyui: {
		themes: [
			{
				light: {
					...require('daisyui/src/theming/themes')['light'],
					primary: '#ffffff',
					'primary-content': '#292929',
					secondary: '#f1f3f5',
					'secondary-content': '#696969',
					// accent: '#32cd32', // Default accent

					// warning: '#ffcc00', // Highlights
					// pink: '#ff69b4', // Decorative
					// purple: '#a260ff', // Rich features
				},
			},
		],
	},
};
