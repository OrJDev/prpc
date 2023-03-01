/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ExpectedFn, ValueOrAccessor } from './types'

export const unwrapValue = <V extends ValueOrAccessor<any>>(
  value: V
): V extends ValueOrAccessor<infer R> ? R : never => {
  if (typeof value === 'function') {
    return value()
  }
  return value as V extends ValueOrAccessor<infer R> ? R : never
}

export const genQueryKey = (key: string, input?: any, isMutation = false) => {
  if (key) {
    return [key, input].filter(Boolean)
  }
  if (isMutation) {
    return undefined
  }
  return ['prpc.query', input].filter(Boolean)
}

export const getPRPCInput = (
  ...args: any[]
): {
  key: string
  fn: ExpectedFn
} => {
  if (args.length === 3) {
    return {
      fn: args[0] as ExpectedFn,
      key: args[2],
    }
  }
  return {
    fn: args[0] as ExpectedFn,
    key: args[1],
  }
}

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const fakeUse = (_: any) => null
