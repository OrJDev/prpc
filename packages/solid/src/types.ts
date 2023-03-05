/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FunctionedParams,
  QueryKey,
  SolidMutationOptions,
  SolidQueryOptions,
} from '@adeora/solid-query'

export type FCreateQueryOptions<
  TQueryFnData = unknown,
  TError = Error,
  TData = TQueryFnData,
  TQueryKey extends QueryKey = QueryKey
> = FunctionedParams<
  OmitQueryData<SolidQueryOptions<TQueryFnData, TError, TData, TQueryKey>>
>

export type FCreateMutationOptions<
  TData = unknown,
  TError = Error,
  TVariables = void,
  TContext = unknown
> = FunctionedParams<
  OmitQueryData<SolidMutationOptions<TData, TError, TVariables, TContext>>
>

export type ModifQueryOptions<T extends FunctionedParams<any>> =
  FunctionedParams<MergeRedirect<ReturnType<T>>>

export type InferReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer R2>
    ? R2
    : R
  : unknown

export type ValueOrAccessor<T = unknown> = T extends undefined
  ? void | undefined
  : T | (() => T)

export type ExpectedInput<T, Ctx = any> = {
  payload: T
  request$: Request
  ctx$: Ctx
}

export type InferFinalMiddlware<Mw extends IMiddleware[] | IMiddleware> =
  Mw extends [
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    ...infer _Start,
    infer Last
  ]
    ? InferReturnType<Last>
    : InferReturnType<Mw>

export type FilteredKeys<T> = {
  [K in keyof T]: T[K] extends Response ? never : K
}[keyof T]

export type FilterOutNever<T> = {
  [K in FilteredKeys<T>]: T[K]
}

export type ExpectedFn<T = any, Mw extends IMiddleware[] = any[]> = (
  props: ExpectedInput<T, FilterOutNever<InferFinalMiddlware<Mw>>>
) => any

export type AsParam<
  Fn extends ExpectedFn,
  CAccessor extends boolean = true
> = CAccessor extends true
  ? ValueOrAccessor<UnwrapFnInput<Parameters<Fn>[0]>>
  : UnwrapFnInput<Parameters<Fn>[0]>

export type UnwrapFnInput<T> = T extends ExpectedInput<infer B> ? B : T

export type OmitQueryData<T> = Omit<T, 'queryKey' | 'queryFn'>

export type MergeRedirect<T> = T & { alwaysCSRRedirect?: boolean }

export type IMiddleware<T = any> = (ctx$: T & { request$: Request }) => any
