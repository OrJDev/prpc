/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@adeora/solid-query'
import type { z, ZodObject } from 'zod'
import type {
  ExpectedFn,
  FCreateQueryOptions,
  InferReturnType,
  AsParam,
  ModifQueryOptions,
} from './types'
import { genQueryKey, getNewOpts, tryAndWrap, unwrapValue } from './utils'

export function query$<
  ZObj extends ZodObject<any> | undefined,
  Fn extends ExpectedFn<ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj) {
  return (
    input: AsParam<Fn>,
    queryOpts?: ModifQueryOptions<FCreateQueryOptions<InferReturnType<Fn>>>
  ) => {
    const newOpts = getNewOpts(queryOpts)
    return createQuery(() => ({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input, newOpts?.().alwaysCSRRedirect),
      ...((newOpts?.() || {}) as any),
    })) as CreateQueryResult<InferReturnType<Fn>>
  }
}
