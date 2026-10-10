import { defineConfig, loadEnv } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig(({ mode }) => {
  const env = loadEnv(mode, process.cwd(), '');

  return {
    plugins: [
      react(),
    ],
    build: {
      outDir: 'build',
      emptyOutDir: true,
    },
    define: {
      'process.env.REACT_APP_TRANSIT_API_KEY': JSON.stringify(env.REACT_APP_TRANSIT_API_KEY || ''),
      'process.env.REACT_APP_GOOGLE_MAPS_STYLE_ID': JSON.stringify(env.REACT_APP_GOOGLE_MAPS_STYLE_ID || ''),
      'process.env.REACT_APP_GOOGLE_MAPS_API_KEY': JSON.stringify(env.REACT_APP_GOOGLE_MAPS_API_KEY || ''),
      'process.env.NODE_ENV': JSON.stringify(mode === 'production' ? 'production' : 'development'),
      'process.env.PUBLIC_URL': JSON.stringify(''),
    },
    test: {
      globals: true,
      environment: 'jsdom',
      setupFiles: './src/setupTests.js',
    },
  };
});
