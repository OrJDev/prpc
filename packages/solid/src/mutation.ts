/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createMutation,
  type CreateMutationResult,
} from '@tanstack/solid-query'
import type zod from 'zod'
import type { FCreateMutationOptions } from './types'
import {
  type IMiddleware,
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  genQueryKey,
  tryAndWrap,
} from '@prpc/core'
import { useNavigate } from 'solid-start'

export function mutation$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj, ..._middlewares: Mw) {
  return (
    mutationOpts?: FCreateMutationOptions<
      InferReturnType<Fn>,
      Error,
      AsParam<Fn, false>
    >
  ) => {
    const navigate = useNavigate()
    return createMutation(() => ({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) =>
        tryAndWrap(queryFn, input, navigate),
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>
  }
}
