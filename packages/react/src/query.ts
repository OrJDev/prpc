/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  type QueryClient,
  useQuery,
  type UseQueryOptions,
  type UseQueryResult,
  useQueryClient,
  dehydrate,
  type DehydratedState,
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
  ZObj extends zod.ZodSchema | void | undefined = void | undefined
>(
  params: ObjectParams<ZObj, Mw, Fn>
): {
  (
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
  ): UseQueryResult<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
  prefetch: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>
  ) => Promise<InferReturnType<Fn>>
  fullyDehydrate: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>,
    fn?: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
  ) => Promise<{ prpcState: DehydratedState }>
  callRaw: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
}

export function query$<
  ZObj extends zod.ZodSchema | void | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<undefined, Mw>
>(
  queryFn: Fn,
  key: string,
  ..._middlewares: Mw
): {
  (
    input: WithVoid<
      ZObj extends void | undefined
        ? void | undefined
        : ZObj extends zod.ZodSchema
        ? zod.infer<ZObj>
        : void | undefined
    >,
    queryOpts?: UseQueryOptions<InferReturnType<Fn>, PRPCClientError<any>>
  ): UseQueryResult<InferReturnType<Fn>, PRPCClientError<any>>
  prefetch: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>
  ) => Promise<InferReturnType<Fn>>
  fullyDehydrate: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>,
    fn?: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
  ) => Promise<{ prpcState: DehydratedState }>
  callRaw: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
}

export function query$<
  ZObj extends zod.ZodSchema | void | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : void, Mw>
>(
  queryFn: Fn,
  key: string,
  _schema?: ZObj,
  ..._middlewares: Mw
): {
  (
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
  ): UseQueryResult<
    InferReturnType<Fn>,
    PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
  >
  prefetch: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>
  ) => Promise<InferReturnType<Fn>>
  fullyDehydrate: (
    queryClient: QueryClient,
    input: AsParam<Fn, false>,
    fn?: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
  ) => Promise<{ prpcState: DehydratedState }>
  callRaw: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
}

export function query$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
>(...args: any[]) {
  const { key, queryFn } = getParams(false, ...args)

  const prefetch = (queryClient: QueryClient, input: AsParam<Fn, false>) => {
    return queryClient.prefetchQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input),
    })
  }

  const fullyDehydrate = async (
    queryClient: QueryClient,
    input: AsParam<Fn, false>,
    fn?: (input: AsParam<Fn, false>) => Promise<InferReturnType<Fn>>
  ) => {
    await queryClient.prefetchQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(fn ?? (queryFn as any), input),
    })
    return { prpcState: dehydrate(queryClient) }
  }

  const fn = (
    input: AsParam<Fn, false>,
    queryOpts?: UseQueryOptions<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
    >
  ) => {
    const queryClient = useQueryClient()
    if (
      typeof window === 'undefined' &&
      queryOpts?.enabled !== false &&
      !queryClient.getQueryCache().find(genQueryKey(key, unwrapValue(input)))
    ) {
      void prefetch(queryClient, input)
    }
    return useQuery({
      queryKey: genQueryKey(key, unwrapValue(input)),
      queryFn: () => tryAndWrap(queryFn, input),
      ...(queryClient.getQueryCache().find(genQueryKey(key, unwrapValue(input)))
        ?.state.status === 'error'
        ? {
            retryOnMount: false,
            ...queryOpts,
          }
        : queryOpts),
    }) as UseQueryResult<
      InferReturnType<Fn>,
      PRPCClientError<ZObj extends zod.ZodSchema ? zod.infer<ZObj> : any>
    >
  }

  return new Proxy(fn, {
    get: (target, prop) => {
      if (prop === 'prefetch') {
        return prefetch
      } else if (prop === 'fullyDehydrate') {
        return fullyDehydrate
      } else if (prop === 'callRaw') {
        return queryFn
      }
      return target
    },
  })
}
