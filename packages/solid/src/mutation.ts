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
  genQueryKey,
  tryAndWrap,
} from '@prpc/core'

export type FCreateMutationOptions<
  TData = unknown,
  TError = PRPCClientError,
  TVariables = void,
  TContext = unknown
> = FunctionedParams<
  OmitQueryData<SolidMutationOptions<TData, TError, TVariables, TContext>>
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
  mutationOpts?: FCreateMutationOptions<
    InferReturnType<Fn>,
    PRPCClientError<any>,
    AsParam<Fn, false>
  >
) => CreateMutationResult<
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
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(queryFn: Fn, key: string) {
  return (
    mutationOpts?: FCreateMutationOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  ) => {
    return createMutation(() => ({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) => tryAndWrap(queryFn, input),
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>,
      AsParam<Fn, false>
    >
  }
}
