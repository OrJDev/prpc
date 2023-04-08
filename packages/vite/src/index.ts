/* eslint-disable @typescript-eslint/no-explicit-any */
import * as babel from '@babel/core'
import type { Plugin } from 'vite'
import { createTransformpRPC$, type PRPCAdapter } from './babel'
import { createFilter, type FilterPattern } from '@rollup/pluginutils'

export interface PRPCPluginOptions {
  babel?: babel.TransformOptions
  adapter: PRPCAdapter
  filter?: {
    include?: FilterPattern
    exclude?: FilterPattern
  }
}
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
        const plugins: babel.ParserOptions['plugins'] = ['typescript', 'jsx']
        const transformpRPC$ = createTransformpRPC$(opts?.adapter ?? 'solid')
        const transformed = await babel.transformAsync(code, {
          presets: [
            ['@babel/preset-typescript'],
            ...(opts?.babel?.presets ?? []),
          ],
          parserOpts: {
            plugins,
          },
          plugins: [[transformpRPC$], ...(opts?.babel?.plugins ?? [])],
          filename: id,
        })
        if (transformed) {
          // console.log(transformed.code)
          return {
            code: transformed.code ?? '',
            map: transformed.map,
          }
        }
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
