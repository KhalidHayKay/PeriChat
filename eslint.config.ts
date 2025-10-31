import js from '@eslint/js';
import importPlugin from 'eslint-plugin-import';
import prettier from 'eslint-plugin-prettier';
import react from 'eslint-plugin-react';
import reactHooks from 'eslint-plugin-react-hooks';
import reactRefresh from 'eslint-plugin-react-refresh';
import { defineConfig, globalIgnores } from 'eslint/config';
import globals from 'globals';
import tseslint from 'typescript-eslint';

export default defineConfig([
    globalIgnores(['dist', 'node_modules', 'build', '.next']),

    {
        files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
        languageOptions: {
            ecmaVersion: 'latest',
            globals: globals.browser,
            sourceType: 'module',
        },

        plugins: {
            import: importPlugin,
            react,
            'react-hooks': reactHooks,
            'react-refresh': reactRefresh,
            prettier,
        },

        // extended configs
        extends: [js.configs.recommended, ...tseslint.configs.recommended],

        // rules overide
        rules: {
            'import/order': 'off',
            'import/first': 'off',
            'import/newline-after-import': 'off',
            'import/no-duplicates': 'off',

            // React & TS preferences
            'react/no-unescaped-entities': 'off',
            'react/react-in-jsx-scope': 'off',
            '@typescript-eslint/no-explicit-any': 'warn',

            // Prettier integration
            'prettier/prettier': 'warn',
        },

        settings: {
            react: { version: 'detect' },
            'import/resolver': {
                typescript: {
                    project: './tsconfig.json',
                },
            },
        },
    },
]);
