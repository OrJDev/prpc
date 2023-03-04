/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FunctionedParams,
  QueryKey,
  SolidMutationOptions,
  SolidQueryOptions,
} from '@adeora/solid-query'
import type { MergeRedirect, OmitQueryData } from '@prpc/core/types'

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
