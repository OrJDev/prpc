/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from '@adeora/solid-query'
import type { z, ZodObject } from 'zod'
import type {
  ExpectedFn,
  FCreateMutationOptions,
  InferReturnType,
  AsParam,
} from './types'
import { genQueryKey, tryAndWrap } from './utils'

export function mutation$<
  ZObj extends ZodObject<any> | undefined,
  Fn extends ExpectedFn<ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj) {
  return (
    mutationOpts?: FCreateMutationOptions<
      InferReturnType<Fn>,
      Error,
      AsParam<Fn, false>
    >
  ) =>
    createMutation(() => ({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) => tryAndWrap(queryFn, input),
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>
}
