/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@adeora/solid-query'
import { useNavigate } from 'solid-start'
import type { z, ZodObject } from 'zod'
import type {
  FCreateQueryOptions,
  ModifQueryOptions,
  InferReturnType,
  ExpectedFn,
  AsParam,
  IMiddleware,
} from './types'
import { genQueryKey, tryAndWrap, unwrapValue } from './utils'

export function query$<
  ZObj extends ZodObject<any> | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj, ..._middlewares: Mw) {
  return (
    input: AsParam<Fn>,
    queryOpts?: ModifQueryOptions<FCreateQueryOptions<InferReturnType<Fn>>>
  ) => {
    const navigate = useNavigate()
    return createQuery(() => ({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () =>
        tryAndWrap(queryFn, input, navigate, queryOpts?.().alwaysCSRRedirect),
      ...((queryOpts?.() || {}) as any),
    })) as CreateQueryResult<InferReturnType<Fn>>
  }
}
