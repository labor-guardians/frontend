import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import tailwindcss from '@tailwindcss/vite';

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const config = {
    plugins: [react(), tailwindcss()],
  };

  // if (mode === 'development') {
  //   config.server = {
  //     proxy: {
  //       '/api': {
  //         target: 'http://18.219.49.169:8080/',
  //         changeOrigin: true,
  //         rewrite: (path) => path.replace(/^\/api/, ''),
  //         secure: false,
  //         ws: true,
  //       },
  //     },
  //   };
  // }

  return config;
});
