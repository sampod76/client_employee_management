import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

import tsconfigPaths from 'vite-tsconfig-paths';
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  server: {
    port: 3001, // Set the dev server port to 3001
  },
  preview: {
    port: 3001,
  },
  optimizeDeps: {
    include: ['@tensorflow-models/face-landmarks-detection', 'react-webcam'],
  },
  resolve: {
    alias: {
      '@assets': '/src/assets',
      '@components': '/src/components',
      '@constants': '/src/constants',
      '@helpers': '/src/helpers',
      '@pages': '/src/pages',
      '@redux': '/src/redux',
      '@routes': '/src/routes',
      '@schemas': '/src/schemas',
      '@types': '/src/types',
      '@utils': '/src/utils',
    },
  },
});
