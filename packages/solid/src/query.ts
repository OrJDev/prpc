/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@tanstack/solid-query'
import { useNavigate } from 'solid-start'
import type zod from 'zod'
import type { FCreateQueryOptions } from './types'
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
    queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
  ) => {
    const navigate = useNavigate()
    return createQuery(() => ({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input, navigate, handleRedirect),
      ...((queryOpts?.() || {}) as any),
    })) as CreateQueryResult<InferReturnType<Fn>>
  }
}
