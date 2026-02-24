import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5110,
  },
  build: {
    // Tăng limit cảnh báo chunk
    chunkSizeWarningLimit: 1000,
    rollupOptions: {
      output: {
        // Tách vendor ra chunk riêng để browser cache tốt hơn
        manualChunks: {
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          'firebase-app': ['firebase/app', 'firebase/auth'],
          'firebase-db': ['firebase/firestore'],
          'firebase-storage': ['firebase/storage'],
          'gemini': ['@google/generative-ai'],
        }
      }
    }
  }
})
