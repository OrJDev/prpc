/* eslint-disable @typescript-eslint/ban-types */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type {
  FunctionedParams,
  QueryKey,
  SolidMutationOptions,
  SolidQueryOptions,
} from '@tanstack/solid-query'
import type { OmitQueryData } from '@prpc/core'

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
