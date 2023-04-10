/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
} from '@tanstack/react-query'
import type zod from 'zod'
import {
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  type IMiddleware,
  type ObjectParams,
  type PRPCClientError,
  type WithVoid,
  genQueryKey,
  tryAndWrap,
  unwrapValue,
  getParams,
} from '@prpc/core'

export function query$<
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends void | undefined
      ? void | undefined
      : ZObj extends zod.ZodSchema
      ? zod.infer<ZObj>
      : void | undefined,
    Mw
  >,
  ZObj extends zod.ZodSchema | void | undefined
>(
  params: ObjectParams<ZObj, Mw, Fn>
): (
  input: WithVoid<
    ZObj extends void | undefined
      ? void | undefined
      : ZObj extends zod.ZodSchema
      ? zod.infer<ZObj>
      : void | undefined
  >,
  queryOpts?: UseQueryOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
) => UseQueryResult<
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
  input: void | undefined,
  queryOpts?: UseQueryOptions<InferReturnType<Fn>, PRPCClientError<any>>
) => UseQueryResult<InferReturnType<Fn>, PRPCClientError<any>>

export function query$<
  ZObj extends zod.ZodSchema | void | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : void, Mw>
>(
  queryFn: Fn,
  key: string,
  _schema?: ZObj,
  ..._middlewares: Mw
): (
  input: WithVoid<
    ZObj extends void | undefined
      ? void | undefined
      : ZObj extends zod.ZodSchema
      ? zod.infer<ZObj>
      : void | undefined
  >,
  queryOpts?: UseQueryOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
) => UseQueryResult<
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
    input: AsParam<Fn, false>,
    queryOpts?: UseQueryOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
    >
  ) =>
    useQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input),
      ...((queryOpts || {}) as any),
    }) as UseQueryResult<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
    >
}
