/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  ValueOrAccessor,
  ExpectedFn,
  AsParam,
  ModifQueryOptions,
  FCreateQueryOptions,
  InferReturnType,
  FCreateMutationOptions,
} from './types'
import {
  isRedirectResponse,
  redirect as _redirect,
  useNavigate,
} from 'solid-start'
import { mergeProps } from 'solid-js'

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

export async function handleResponse(
  response: Response,
  alwaysCSRRedirect?: boolean
) {
  if (isRedirectResponse(response)) {
    const url = response.headers.get('location')
    if (url) {
      if (typeof window !== 'undefined' && !alwaysCSRRedirect) {
        window.location.href = url
      } else {
        return {
          redirect: url,
        }
      }
    }
  }
  return {
    response: await response.json(),
  }
}
export async function tryAndWrap<Fn extends ExpectedFn>(
  queryFn: Fn,
  input: AsParam<Fn, false | true>,
  alwaysCSRRedirect?: boolean
) {
  const response = await queryFn({
    payload: unwrapValue(input) as any,
    request$: {} as unknown as Request, // babel will handle this
  })
  if (response instanceof Response) {
    const newResp = await handleResponse(response, alwaysCSRRedirect)
    if ('response' in newResp) {
      return newResp.response
    } else return newResp
  }
  return response
}

export const replyWith = <T>(value: T, init?: ResponseInit): T => {
  return new Response(
    typeof value === 'string' ? value : JSON.stringify(value),
    init
  ) as unknown as T
}

export const redirect = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  return _redirect(url, init) as any
}

export const optionalData = async (response: Response) => {
  try {
    return await response.json()
  } catch {
    return undefined
  }
}

export const getNewOpts = <
  Opts extends
    | ModifQueryOptions<FCreateQueryOptions<InferReturnType<ExpectedFn>>>
    | ModifQueryOptions<
        FCreateMutationOptions<
          InferReturnType<ExpectedFn>,
          Error,
          AsParam<ExpectedFn, false>
        >
      >
>(
  queryOpts?: Opts
) => {
  const navigate = useNavigate()
  return () =>
    // eslint-disable-next-line solid/reactivity
    mergeProps(queryOpts?.(), {
      onSuccess: async (
        data: Response | InferReturnType<ExpectedFn>,
        variables: any,
        context: any
      ) => {
        if (data instanceof Response) {
          const newResp = await handleResponse(
            data,
            queryOpts?.().alwaysCSRRedirect
          )
          if (newResp.redirect) {
            navigate(newResp.redirect)
          } else {
            return queryOpts?.().onSuccess?.(
              newResp.response,
              variables,
              context
            )
          }
        } else {
          return await queryOpts?.().onSuccess?.(data, variables, context)
        }
      },
      onSettled: async (
        data: Response | InferReturnType<ExpectedFn>,
        err: any,
        variables: any,
        context: any
      ) => {
        if (data instanceof Response) {
          return await queryOpts?.().onSettled?.(
            await optionalData(data),
            err,
            variables,
            context
          )
        } else {
          return await queryOpts?.().onSettled?.(data, err, variables, context)
        }
      },
    })
}
