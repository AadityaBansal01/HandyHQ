// vite.config.js — tells Vite how to build/run our React app
// we're adding the Tailwind plugin here so Tailwind's styles get processed automatically

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [
    react(),      // lets Vite understand React/JSX syntax
    tailwindcss(), // lets Vite understand Tailwind's utility classes
  ],
})