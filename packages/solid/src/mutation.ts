/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from '@adeora/solid-query'
import type { z, ZodObject } from 'zod'
import type {
  AsParam,
  ExpectedFn,
  FCreateMutationOptions,
  InferReturnType,
} from './types'
import { genQueryKey, getPRPCInput, unwrapValue } from './utils'

export function mutation$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  key: string,
  schema: ZObj
): (
  mutationOpts?: FCreateMutationOptions<InferReturnType<Fn>>
) => CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>

export function mutation$<Fn extends ExpectedFn>(
  queryFn: Fn,
  key: string
): (
  mutationOpts?: FCreateMutationOptions<InferReturnType<Fn>>
) => CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>

export function mutation$(...args: any[]) {
  const { key, fn } = getPRPCInput(...args)
  return (mutationOpts?: any) =>
    createMutation(() => ({
      mutationKey: genQueryKey(key),
      mutationFn: (input: any) => fn(unwrapValue(input)),
      ...((mutationOpts?.() || {}) as any),
    })) as any
}
