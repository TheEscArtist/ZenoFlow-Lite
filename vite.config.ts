import path from 'path';
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  server: {
    port: 3000,
    host: '0.0.0.0',
  },
  css: {
    devSourcemap: false,
  },
  plugins: [react()],
  // 删除 define 部分
  resolve: {
    alias: {
      '@': path.resolve(__dirname, '.'),
    }
  }
});