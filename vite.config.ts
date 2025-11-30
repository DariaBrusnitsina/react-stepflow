import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  base: process.env.NODE_ENV === 'production' 
    ? '/react-stepflow/' // Replace 'react-stepflow' with your repository name
    : '/',
  build: {
    outDir: 'dist',
  },
})

