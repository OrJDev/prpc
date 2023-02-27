/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from '@adeora/solid-query'
import type { Accessor } from 'solid-js'
import type { z, ZodObject } from 'zod'
import type {
  ExpectedFn,
  FCreateQueryOptions,
  InferReturnType,
  Input,
  PRPCOptions,
  ValueOrAccessor,
} from './types'
import { genQueryKey, getPRPCInput, getPrpcInputV2, unwrapValue } from './utils'

export function query$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  schema: ZObj,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function query$<Fn extends ExpectedFn>(
  queryFn: Fn,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function query$(...args: any[]) {
  const { fn, opts } = getPRPCInput(...args)

  return (input: any, queryOpts: any) => {
    const innerArgs = () => unwrapValue(input)
    return createQuery(() => ({
      queryKey: genQueryKey(innerArgs(), opts),
      queryFn: () => fn(innerArgs()),
      ...((queryOpts?.() || {}) as any),
    }))
  }
}

export function queryV2$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<Input<z.infer<ZObj>>>
>(
  queryFn: Fn,
  schema: ZObj,
  key: string
): (
  payload: Accessor<z.infer<ZObj>>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function queryV2$<
  Payload extends object | never = never,
  Fn extends ExpectedFn = ExpectedFn<Input<Payload>>
>(
  queryFn: Fn,
  key: string
): (
  payload: Accessor<Payload>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function queryV2$(...args: any[]) {
  const { fn, key } = getPrpcInputV2(...args)

  return (input: any, queryOpts: any) => {
    const innerArgs = () => (input ? unwrapValue(input) : null)
    return createQuery(() => ({
      queryKey: genQueryKey(innerArgs(), key),
      queryFn: () => fn({ payload: innerArgs() }),
      ...((queryOpts?.() || {}) as any),
    }))
  }
}
