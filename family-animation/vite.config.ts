import react from '@vitejs/plugin-react'
import { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@engine':     resolve(import.meta.dirname, 'src/engine'),
      '@characters': resolve(import.meta.dirname, 'src/characters'),
      '@scenes':     resolve(import.meta.dirname, 'src/scenes'),
      '@ui':         resolve(import.meta.dirname, 'src/ui'),
      '@store':      resolve(import.meta.dirname, 'src/store'),
      '@hooks':      resolve(import.meta.dirname, 'src/hooks'),
      '@types-app':  resolve(import.meta.dirname, 'src/types'),
    },
  },
  assetsInclude: ['**/*.glb', '**/*.gltf'],
})


