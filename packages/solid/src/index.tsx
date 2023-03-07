import { redirect } from 'solid-start'

export * from './QueryProvider'
export * from './mutation'
export * from './query'
export * from './types'
export * from '@prpc/core'

export const redirect$ = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return redirect(url, init) as any
}
