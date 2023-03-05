import solid from 'solid-start/vite'
import { defineConfig } from 'vite'
import prpc from '@prpc/vite'
import vercel from 'solid-start-vercel'

export default defineConfig(() => {
  return {
    plugins: [prpc(), solid({ ssr: true, adapter: vercel({ edge: false }) })],
  }
})
