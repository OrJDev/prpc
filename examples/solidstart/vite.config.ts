import prpc from '@prpc/solid'
import solid from 'solid-start/vite'
import { defineConfig } from 'vite'

export default defineConfig(() => {
  return {
    plugins: [prpc(), solid({ ssr: true })],
  }
})
