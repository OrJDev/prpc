/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  useMutation,
  type UseMutationResult,
  type UseMutationOptions,
} from '@tanstack/react-query'
import type zod from 'zod'
import {
  type IMiddleware,
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  type PRPCClientError,
  type ObjectParams,
  genQueryKey,
  tryAndWrap,
  getParams,
} from '@prpc/core'

export function mutation$<
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends void | undefined
      ? void | undefined
      : ZObj extends zod.ZodSchema
      ? zod.infer<ZObj>
      : void | undefined,
    Mw
  >,
  ZObj extends zod.ZodSchema | void | undefined = void | undefined
>(
  params: ObjectParams<ZObj, Mw, Fn, true>
): (
  mutationOpts?: UseMutationOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
    AsParam<Fn, false>
  >
) => UseMutationResult<
  InferReturnType<Fn>,
  PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
  AsParam<Fn, false>
>

export function mutation$<
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<undefined, Mw>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(
  queryFn: Fn,
  key: string,
  ..._middlewares: Mw
): (
  mutationOpts?: UseMutationOptions<
    InferReturnType<Fn>,
    PRPCClientError<any>,
    AsParam<Fn, false>
  >
) => UseMutationResult<
  InferReturnType<Fn>,
  PRPCClientError<any>,
  AsParam<Fn, false>
>

export function mutation$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(
  queryFn: Fn,
  key: string,
  _schema?: ZObj,
  ..._middlewares: Mw
): (
  mutationOpts?: UseMutationOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
    AsParam<Fn, false>
  >
) => UseMutationResult<
  InferReturnType<Fn>,
  PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
  AsParam<Fn, false>
>

export function mutation$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(...args: any[]) {
  const { key, queryFn } = getParams(true, ...args)
  return (
    mutationOpts?: UseMutationOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  ) => {
    return useMutation({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) => tryAndWrap(queryFn, input),
      ...((mutationOpts || {}) as any),
    }) as UseMutationResult<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  }
}
