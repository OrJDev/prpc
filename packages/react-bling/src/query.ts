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
  type PRPCClientError,
  genQueryKey,
  tryAndWrap,
  unwrapValue,
} from '@prpc/core'

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
    queryOpts?: UseQueryOptions<InferReturnType<Fn>, PRPCClientError>
  ) => {
    return useQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input),
      ...((queryOpts || {}) as any),
    }) as UseQueryResult<InferReturnType<Fn>, PRPCClientError>
  }
}
