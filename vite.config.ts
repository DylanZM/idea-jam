import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  envPrefix: ['VITE_', 'AI_PROVIDER_'],
  plugins: [react()],
})
