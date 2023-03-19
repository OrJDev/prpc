/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type zod from 'zod'
import {
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  type IMiddleware,
  genQueryKey,
  tryAndWrap,
  unwrapValue,
} from '@prpc/core'
import { handleRedirect } from './redirect'

export function query$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj, ..._middlewares: Mw) {
  return (
    input: AsParam<Fn>,
    queryOpts?: UseQueryOptions<InferReturnType<Fn>>
  ) => {
    const navigate = (url: string, opts?: { replace: boolean }) => {
      console.log('navigate', url, opts)
    }
    return useQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input, navigate, handleRedirect),
      ...((queryOpts || {}) as any),
    }) as UseQueryResult<InferReturnType<Fn>>
  }
}
