import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'path';

export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@m3core/shared': path.resolve(__dirname, '../../packages/shared/src'),
      '@m3core/types': path.resolve(__dirname, '../../packages/types/src'),
      '@m3core/ui': path.resolve(__dirname, '../../packages/ui/src'),
    },
  },
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
      },
    },
  },
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'ui-vendor': ['lucide-react', 'clsx', 'tailwind-merge'],
          'query-vendor': ['@tanstack/react-query', 'axios'],
          'form-vendor': ['react-hook-form', 'zod', '@hookform/resolvers'],
          'i18n-vendor': ['i18next', 'react-i18next'],
        },
      },
    },
  },
});