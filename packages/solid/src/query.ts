/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createQuery,
  type FunctionedParams,
  type QueryKey,
  type CreateQueryResult,
  type SolidQueryOptions,
} from '@tanstack/solid-query'
import type zod from 'zod'
import {
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  type IMiddleware,
  type OmitQueryData,
  type PRPCClientError,
  type ObjectParams,
  genQueryKey,
  tryAndWrap,
  unwrapValue,
} from '@prpc/core'
import { getParams } from '@prpc/core'

export type FCreateQueryOptions<
  TQueryFnData = unknown,
  TError = PRPCClientError,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = FunctionedParams<
  OmitQueryData<SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
>

export function query$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(
  params: ObjectParams<ZObj, Mw, Fn>
): (
  input: AsParam<Fn>,
  queryOpts?: FCreateQueryOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
) => CreateQueryResult<
  InferReturnType<Fn>,
  PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
>

export function query$<
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<undefined, Mw>
>(
  queryFn: Fn,
  key: string,
  ..._middlewares: Mw
): (
  input: AsParam<Fn>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>, PRPCClientError<any>>
) => CreateQueryResult<InferReturnType<Fn>, PRPCClientError<any>>

export function query$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(
  queryFn: Fn,
  key: string,
  _schema?: ZObj,
  ..._middlewares: Mw
): (
  input: AsParam<Fn>,
  queryOpts?: FCreateQueryOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
) => CreateQueryResult<
  InferReturnType<Fn>,
  PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
>

export function query$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(...args: any[]) {
  const { key, queryFn } = getParams(false, ...args)
  return (
    input: AsParam<Fn>,
    queryOpts?: FCreateQueryOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
    >
  ) => {
    return createQuery(() => ({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input),
      ...((queryOpts?.() || {}) as any),
    }))
  }
}
