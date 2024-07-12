import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react-swc';

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  proxy: {
    '/api': {
      target: 'http://localhost:4500',
      changeOrigin: true,
    },
  },
});
