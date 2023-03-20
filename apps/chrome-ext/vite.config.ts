import path from 'path'
import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    host: '0.0.0.0',
  },
  build: {
    rollupOptions: {
      input: {
        popup: path.resolve(__dirname, 'popup.html'),
        content_script: path.resolve(__dirname, 'src/content_script.ts'),
      },
      output: {
        entryFileNames: `assets/[name].js`,
      },
    },
  },
})
