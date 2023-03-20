import { defineConfig } from 'astro/config'
import node from '@astrojs/node'
import { astroBling } from '@tanstack/bling/astro'
import solidJs from '@astrojs/solid-js'
import { astroPRPC } from '@prpc/vite'

// https://astro.build/config
export default defineConfig({
  output: 'server',
  adapter: node({
    mode: 'standalone',
  }),
  integrations: [
    astroPRPC({
      adapter: 'solid-bling',
    }),
    astroBling(),
    solidJs(),
  ],
})
