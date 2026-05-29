import { defineConfig } from 'vite'

export default defineConfig({
  // Base para GitHub Pages: reemplazá 'skydev' con el nombre exacto de tu repo
  base: '/skydev/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
  },
  server: {
    port: 3000,
    open: true,
  },
})
