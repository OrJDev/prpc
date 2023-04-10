/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Plugin } from 'vite'
import { createFilter } from '@rollup/pluginutils'
import { compilepRRPC, type PRPCPluginOptions } from '@prpc/compiler'

const DEFAULT_INCLUDE = 'src/**/*.{jsx,tsx,ts,js,mjs,cjs}'
const DEFAULT_EXCLUDE = 'node_modules/**/*.{jsx,tsx,ts,js,mjs,cjs}'

export default function prpc(opts?: PRPCPluginOptions): Plugin {
  const filter = createFilter(
    opts?.filter?.include || DEFAULT_INCLUDE,
    opts?.filter?.exclude || DEFAULT_EXCLUDE
  )
  return {
    enforce: 'pre',
    name: 'prpc',
    async transform(code: string, id: string) {
      if (!filter(id)) {
        return code
      }
      if (
        ((code.includes('query$(') || code.includes('mutation$(')) &&
          id.endsWith('.ts')) ||
        id.endsWith('.tsx')
      ) {
        return await compilepRRPC(code, id, opts)
      }
      return undefined
    },
  }
}

export function astroPRPC(opts: PRPCPluginOptions) {
  return {
    name: 'prpc',
    hooks: {
      'astro:config:setup': (config: any) => {
        config.updateConfig({
          vite: {
            plugins: [prpc(opts)],
          },
        })
      },
    },
  }
}
