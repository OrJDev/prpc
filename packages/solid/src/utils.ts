/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ValueOrAccessor, ExpectedFn, AsParam } from './types'

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

export async function tryAndWrap<Fn extends ExpectedFn>(
  queryFn: Fn,
  input: AsParam<Fn, false | true>
) {
  const response = await queryFn({
    payload: unwrapValue(input) as any,
    request$: {} as unknown as Request, // babel will handle this
  })
  if (response instanceof Response) {
    const text = await response.text()
    try {
      return JSON.parse(text)
    } catch {
      return text
    }
  }
  return response
}

export const replyWith = <T>(value: T, init?: ResponseInit): T => {
  return new Response(
    typeof value === 'string' ? value : JSON.stringify(value),
    init
  ) as unknown as T
}
