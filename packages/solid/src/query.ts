/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@tanstack/solid-query'
import type { z, ZodObject } from 'zod'
import type {
  ExpectedFn,
  FCreateQueryOptions,
  InferReturnType,
  ValueOrAccessor,
} from './types'
import { genQueryKey, unwrapValue } from './utils'

export function query$<
  ZObj extends ZodObject<any> | undefined,
  Fn extends ExpectedFn<ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj) {
  return (
    input: ValueOrAccessor<Parameters<Fn>[0]>,
    queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
  ): CreateQueryResult<InferReturnType<Fn>> => {
    const innerArgs = () => unwrapValue(input)
    return createQuery(() => ({
      queryKey: genQueryKey(innerArgs() as any, key),
      queryFn: () => queryFn(innerArgs() as any),
      ...((queryOpts?.() || {}) as any),
    })) as any
  }
}
