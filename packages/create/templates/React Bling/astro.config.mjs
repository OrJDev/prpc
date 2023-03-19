import { defineConfig } from 'astro/config'
import react from '@astrojs/react'
import node from '@astrojs/node'
import { astroBling } from '@tanstack/bling/astro'
import { astroPRPC } from '@prpc/vite'

export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    astroPRPC({
      adapter: 'react-bling',
    }),
    astroBling(),
    react(),
  ],
})
