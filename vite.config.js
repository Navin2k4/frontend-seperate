import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vitejs.dev/config/
export default defineConfig({
  server: {
    proxy: {
      '/api': {
        target: 'http://navintest.duckdns.org:3000',
        changeOrigin: true,
        secure: false,
      },
    },
  },
  plugins: [react()],
});
