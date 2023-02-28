/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@tanstack/solid-query'
import type { z, ZodObject } from 'zod'
import { getPRPCInput } from '../dist'
import type {
  ExpectedFn,
  FCreateQueryOptions,
  InferReturnType,
  ValueOrAccessor,
} from './types'
import { genQueryKey, unwrapValue } from './utils'

export function query$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  key: string,
  schema: ZObj
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function query$<Fn extends ExpectedFn>(
  queryFn: Fn,
  key: string
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function query$(...args: any[]) {
  const { key, fn } = getPRPCInput(...args)
  return (input: any, queryOpts?: any) => {
    const innerArgs = () => unwrapValue(input)
    return createQuery(() => ({
      queryKey: genQueryKey(innerArgs() as any, key),
      queryFn: () => fn(innerArgs() as any),
      ...((queryOpts?.() || {}) as any),
    })) as any
  }
}
