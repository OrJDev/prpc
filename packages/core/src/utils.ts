/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  AsParam,
  ExpectedFn,
  FilterOutResponse,
  IMiddleware,
  InferFinalMiddlware,
  ValueOrAccessor,
} from './types'
import type { ZodSchema } from 'zod'
import { PRPCClientError } from './error'

export const response$ = <T>(value: T, init?: ResponseInit): T => {
  return new Response(
    typeof value === 'string' ? value : JSON.stringify(value),
    init
  ) as unknown as T
}

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
    return await response.clone().json()
  } catch {
    return await response.clone().text()
  }
}

export const genQueryKey = (
  key: string,
  input?: any,
  isMutation = false
): unknown[] => {
  if (key) {
    return [key, input].filter(Boolean)
  }
  if (isMutation) {
    return [undefined]
  }
  return ['prpc.query', input].filter(Boolean)
}

export function figureOutMessageError(err: any) {
  if (typeof err === 'string') {
    return err
  }
  if (err && typeof err === 'object') {
    if ('formErrors' in err) {
      return 'Invalid Data Was Provided'
    } else if (err instanceof Error || 'message' in err) {
      return err.message
    }
  }
  return 'Unknown Error'
}

export async function tryAndWrap<Fn extends ExpectedFn<any>>(
  queryFn: Fn,
  input: AsParam<Fn, false | true>,
  handleRedirect?: (url: string, response: Response) => any
) {
  try {
    const value = unwrapValue(input)
    const response = await queryFn({
      payload: JSON.stringify(value),
    } as any)
    if (response instanceof Response) {
      const url = response.headers.get('location')
      if (response.headers.get('X-Prpc-Error') === '1') {
        const error = await optionalData(response)
        throw new PRPCClientError(
          figureOutMessageError(error.error),
          error.error
        )
      } else if (!isRedirectResponse(response) || !url) {
        return await optionalData(response)
      } else {
        handleRedirect?.(url, response)
      }
    }
    return response
  } catch (e: any) {
    throw new PRPCClientError(figureOutMessageError(e), e)
  }
}

export const middleware$ = <
  Mw extends IMiddleware<CurrentContext>,
  CurrentContext = unknown
>(
  mw: Mw
): Mw => {
  return mw
}

type Flattened<T> = T extends Array<infer U> ? Flattened<U> : T

export const pipe$ = <
  CurrentMw extends IMiddleware<any> | IMiddleware<any>[],
  Mw extends IMiddleware<FilterOutResponse<InferFinalMiddlware<CurrentMw>>>[]
>(
  currentMw: CurrentMw,
  ...middlewares: Mw
): Flattened<Mw> => {
  if (Array.isArray(currentMw)) {
    return [...currentMw, ...middlewares].flat() as any
  }
  return [currentMw, ...middlewares].flat() as any
}

export const callMiddleware$ = async <Mw extends IMiddleware<any>[]>(
  request: Request,
  middlewares: Mw,
  ctx?: any
) => {
  let currentCtx = ctx ? { ...ctx, request$: request } : { request$: request }
  if (Array.isArray(middlewares)) {
    for (const middleware of middlewares) {
      if (Array.isArray(middleware)) {
        currentCtx = await callMiddleware$(request, middleware, currentCtx)
        if (currentCtx instanceof Response) {
          return currentCtx
        }
      } else {
        currentCtx = await middleware({ request$: request, ...currentCtx })
        if (currentCtx instanceof Response) {
          return currentCtx
        }
      }
    }
    return currentCtx
  } else {
    return await (middlewares as any)({
      request$: request,
      ...ctx,
    })
  }
}

export const hideRequest = <T>(ctx$: T, fully?: boolean) => {
  if (typeof ctx$ === 'object' && ctx$ !== null && 'request$' in ctx$) {
    if (fully) {
      delete (ctx$ as any).request$
    } else {
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      const { request$: _$ignore, ...rest } = ctx$ as any
      return rest
    }
  }
  return ctx$
}

export const error$ = (error: any, init?: ResponseInit): Response => {
  const headers = new Headers(init?.headers)
  headers.set('Content-Type', 'application/json')
  headers.set('X-Prpc-Error', '1')
  return new Response(
    JSON.stringify({
      error: typeof error === 'string' ? { message: error } : error,
    }),
    {
      status: init?.status ?? 400,
      headers,
    }
  ) as any
}

export const validateZod = async <Schema extends ZodSchema>(
  payload: any,
  schema: Schema
) => {
  const res = await schema.safeParseAsync(
    typeof payload === 'object' ? payload : JSON.parse(payload)
  )
  if (!res.success) {
    return error$(res.error.flatten())
  }
  return res.data
}

export const getParams = <T = Record<any, any>>(
  isMutation: boolean,
  ...args: any[]
): {
  queryFn: ExpectedFn<any>
  key: string
  cfg: T
} => {
  args = args.flat().filter(Boolean)
  if (args.length === 1) {
    return {
      queryFn: args[0][isMutation ? 'mutationFn' : 'queryFn'],
      key: args[0].key,
      cfg: args[0].cfg,
    }
  } else {
    const [queryFn, key] = args
    return { queryFn, key, cfg: {} as T }
  }
}

export const consistentResponse = <Fn extends ExpectedFn<unknown>>(fn: Fn) => {
  return async (...args: Parameters<Fn>) => {
    const res = await (fn as any)(...args)
    if (res instanceof Response) {
      return res
    }
    return response$(res)
  }
}
