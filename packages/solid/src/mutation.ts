/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from '@adeora/solid-query'
import type { z, ZodObject } from 'zod'
import type {
  AsParam,
  ExpectedFn,
  FCreateMutationOptions,
  InferReturnType,
} from './types'
import { genQueryKey, unwrapValue } from './utils'

export function mutation$<
  ZObj extends ZodObject<any> | undefined,
  Fn extends ExpectedFn<ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(mutationFn: Fn, key: string, _schema?: ZObj) {
  return (
    mutationOpts?: FCreateMutationOptions<InferReturnType<Fn>>
  ): CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>> =>
    createMutation(() => ({
      mutationKey: genQueryKey(key),
      mutationFn: (input: any) => mutationFn(unwrapValue(input)),
      ...((mutationOpts?.() || {}) as any),
    })) as any
}
