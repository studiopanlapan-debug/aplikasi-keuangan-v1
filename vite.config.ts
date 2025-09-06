import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  base: './', // tambahkan ini jika deploy ke subfolder
  plugins: [react()],
})