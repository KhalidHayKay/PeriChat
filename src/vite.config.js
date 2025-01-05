import react from '@vitejs/plugin-react';
import laravel from 'laravel-vite-plugin';
import { defineConfig } from 'vite';

export default defineConfig({
    manifest: true,
    plugins: [laravel(['resources/js/app.tsx']), react()],
    server: {
        host: '0.0.0.0',
        hmr: {
            host: 'localhost',
        },
    },
});
