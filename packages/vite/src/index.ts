/* eslint-disable @typescript-eslint/no-explicit-any */
import * as babel from '@babel/core'
import type { Plugin } from 'vite'
import { createTransformpRPC$, type PRPCAdapter } from '@prpc/core'

export interface PRPCPluginOptions {
  babel?: babel.TransformOptions
  adapter: PRPCAdapter
}

export default function prpc(opts?: PRPCPluginOptions): Plugin {
  return {
    enforce: 'pre',
    name: 'prpc',
    async transform(code: string, id: string) {
      if (
        (code.includes('query$(') || code.includes('mutation$(')) &&
        id.endsWith('.ts')
      ) {
        const transformpRPC$ = createTransformpRPC$(opts?.adapter ?? 'solid')
        const transformed = await babel.transformAsync(code, {
          presets: [
            ['@babel/preset-typescript'],
            ...(opts?.babel?.presets ?? []),
          ],
          plugins: [[transformpRPC$], ...(opts?.babel?.plugins ?? [])],
          filename: id,
        })
        if (transformed) {
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
