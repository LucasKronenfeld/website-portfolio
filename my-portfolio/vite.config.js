import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import mdx from '@mdx-js/rollup' // <-- Import the plugin

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), mdx()],

})
