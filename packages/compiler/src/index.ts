/* eslint-disable @typescript-eslint/no-explicit-any */
import type babel from '@babel/core'
import { type PRPCAdapter } from './babel'
import { type FilterPattern } from '@rollup/pluginutils'
export { compilepRRPC } from './babel'

export interface PRPCPluginOptions {
  babel?: babel.TransformOptions
  adapter?: PRPCAdapter
  filter?: {
    include?: FilterPattern
    exclude?: FilterPattern
  }
  log?: boolean
}

export * from './babel'
