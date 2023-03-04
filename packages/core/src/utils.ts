/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsParam, ExpectedFn, ValueOrAccessor } from './types'

const redirectStatusCodes = new Set([204, 301, 302, 303, 307, 308])

export function isRedirectResponse(response: Response): response is Response {
  return (
    response &&
    response instanceof Response &&
    redirectStatusCodes.has(response.status)
  )
}

export const unwrapValue = <V extends ValueOrAccessor<any>>(
  value: V
): V extends ValueOrAccessor<infer R> ? R : never => {
  if (typeof value === 'function') {
    return value()
  }
  return value as V extends ValueOrAccessor<infer R> ? R : never
}

export const optionalData = async (response: Response) => {
  try {
    return await response.json()
  } catch {
    return undefined
  }
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
  input: AsParam<Fn, false | true>,
  navigate: (url: string) => any,
  alwaysCSRRedirect?: boolean
) {
  const response = await queryFn({
    payload: unwrapValue(input) as any,
    request$: {} as unknown as Request, // babel will handle this
  })
  if (response instanceof Response) {
    if (!isRedirectResponse(response)) {
      return await optionalData(response)
    } else {
      const url = response.headers.get('location')
      if (!url) {
        try {
          return await response.text()
        } catch {
          return undefined
        }
      }
      if (typeof window !== 'undefined' && !alwaysCSRRedirect) {
        window.location.href = url
      } else {
        navigate(url)
      }
    }
  }
  return response
}
