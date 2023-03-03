/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FunctionedParams,
  QueryKey,
  SolidMutationOptions,
  SolidQueryOptions,
} from '@adeora/solid-query'
import type { Accessor } from 'solid-js'

export type InferReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer R2>
    ? R2
    : R
  : never

export type ValueOrAccessor<T = unknown> = T extends undefined
  ? void | undefined
  : T | Accessor<T>

export type ExpectedInput<T> = {
  payload: T
  request$: Request
}

export type ExpectedFn<T = any> = (props: ExpectedInput<T>) => any

export type AsParam<
  Fn extends ExpectedFn,
  CAccessor extends boolean = true
> = CAccessor extends true
  ? ValueOrAccessor<UnwrapFnInput<Parameters<Fn>[0]>>
  : UnwrapFnInput<Parameters<Fn>[0]>

export type UnwrapFnInput<T> = T extends ExpectedInput<infer B> ? B : T

export type OmitQueryData<T> = Omit<T, 'queryKey' | 'queryFn'>

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
  FunctionedParams<
    ReturnType<T> & {
      alwaysCSRRedirect?: boolean
    }
  >
