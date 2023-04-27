/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  createMutation,
  type FunctionedParams,
  type SolidMutationOptions,
  type CreateMutationResult,
} from '@tanstack/solid-query'
import type zod from 'zod'
import {
  type IMiddleware,
  type InferReturnType,
  type ExpectedFn,
  type AsParam,
  type OmitQueryData,
  type PRPCClientError,
  type ObjectParams,
  genQueryKey,
  tryAndWrap,
  getParams,
} from '@prpc/core'
import { useRequest } from 'solid-start/server'
import { genHandleResponse } from '.'

export type FCreateMutationOptions<
  TData = unknown,
  TError = PRPCClientError,
  TVariables = void,
  TContext = unknown
> = FunctionedParams<
  OmitQueryData<SolidMutationOptions<TData, TError, TVariables, TContext>>
>

export type ExpectedMutationReturn<
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
> = (
  mutationOpts?: FCreateMutationOptions<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
    AsParam<Fn, false>
  >
) => CreateMutationResult<
  InferReturnType<Fn>,
  PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
  AsParam<Fn, false>
>

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
): ExpectedMutationReturn<Mw, Fn, ZObj>

export function mutation$<
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<void | undefined, Mw>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, ..._middlewares: Mw): ExpectedMutationReturn<Mw, Fn>

export function mutation$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends void | undefined
      ? void | undefined
      : ZObj extends zod.ZodSchema
      ? zod.infer<ZObj>
      : void | undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(
  queryFn: Fn,
  key: string,
  _schema?: ZObj,
  ..._middlewares: Mw
): ExpectedMutationReturn<Mw, Fn, ZObj>

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
    mutationOpts?: FCreateMutationOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  ) => {
    const event = useRequest()
    return createMutation(() => ({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) =>
        tryAndWrap(queryFn, input, genHandleResponse(event)),
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  }
}
