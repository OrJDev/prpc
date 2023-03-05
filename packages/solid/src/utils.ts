import { redirect } from 'solid-start'

export const response$ = <T>(value: T, init?: ResponseInit): T => {
  return new Response(
    typeof value === 'string' ? value : JSON.stringify(value),
    {
      ...init,
      headers: {
        'Content-Type': 'application/json',
        ...init?.headers,
      },
    }
  ) as unknown as T
}

export const end$ = (_error: string, init?: ResponseInit): Response => {
  const error = typeof _error === 'string' ? _error : JSON.stringify(_error)
  return new Response(error, {
    ...init,
    headers: {
      ...init?.headers,
      'X-End$': '1',
    },
  })
}

export const redirect$ = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return redirect(url, init) as any
}

/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AsParam,
  ExpectedFn,
  FilterOutNever,
  IMiddleware,
  InferFinalMiddlware,
  ValueOrAccessor,
} from './types'

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

class PRPCClientError extends Error {
  constructor(message: string) {
    super(message)
    this.name = 'PRPCClientError'
  }
}

export async function tryAndWrap<Fn extends ExpectedFn>(
  queryFn: Fn,
  input: AsParam<Fn, false | true>,
  navigate: (url: string) => any,
  alwaysCSRRedirect?: boolean
) {
  const response = await queryFn({
    payload: unwrapValue(input) as any,
    request$: {} as unknown as Request, // babel will handle this,
    ctx$: {} as any, // babel will handle this
  })
  if (response instanceof Response) {
    const xEnd = response.headers.get('X-End$')
    if (xEnd === '1') {
      const txt = await response.text()
      // throw new PRPCClientError(txt)
      return { result: `error is ${txt}` }
    }
    const url = response.headers.get('location')
    if (isRedirectResponse(response) && url) {
      if (typeof window !== 'undefined' && !alwaysCSRRedirect) {
        window.location.href = url
      } else {
        navigate(url)
      }
    } else {
      return await optionalData(response)
    }
  }
  return response
}

export const middleware$ = <
  Mw extends IMiddleware<CurrentContext>,
  CurrentContext = unknown
>(
  mw: Mw
): [Mw] => {
  return [mw]
}

export const pipe$ = <
  CurrentMw extends IMiddleware<any> | IMiddleware<any>[],
  Mw extends IMiddleware<FilterOutNever<InferFinalMiddlware<CurrentMw>>>[]
>(
  currentMw: CurrentMw,
  ...middlewares: Mw
): Mw => {
  if (Array.isArray(currentMw)) {
    return [...currentMw, ...middlewares] as any
  }
  return [currentMw, ...middlewares] as any
}

export const callMiddleware$ = async <Mw extends IMiddleware<any>[]>(
  request: Request,
  middlewares: Mw,
  ctx: any
) => {
  let currentCtx = ctx ?? {}
  for await (const middleware of middlewares) {
    if (Array.isArray(middleware)) {
      const temp: any = await callMiddleware$(request, middleware, currentCtx)
      if (temp instanceof Response) {
        return temp
      }
      currentCtx = temp
      continue
    }
    const temp = await middleware({ request$: request, ...currentCtx })
    if (temp instanceof Response) {
      return temp
    }
    currentCtx = temp
  }
  return currentCtx
}
