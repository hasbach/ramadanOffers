
import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  // استخدام './' يجعل التطبيق يعمل على أي مسار فرعي في GitHub Pages
  base: './',
  define: {
    // هذا يضمن أن 'process.env.API_KEY' يعمل داخل الكود عند البناء
    'process.env.API_KEY': JSON.stringify(process.env.API_KEY)
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  }
});
