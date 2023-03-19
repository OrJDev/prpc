import type { getUserPackageManager } from '~utils/helpers'

export type IAppCtx = {
  userDir: string
  appName: string
  templateDir: string
  pkgManager: ReturnType<typeof getUserPackageManager>
  template: ITemplate
}

export type INullAble<T> = T | null

export type IPromiseOrType<T> = Promise<T> | T

export type IFile = {
  to: string
  content?: string
  type?: 'copy' | 'exec' | 'delete' | 'write' | 'append'
  path?: string
  sep?: boolean
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pass?: any
}

export type ITemplate = 'SolidStart' | 'React Bling'
