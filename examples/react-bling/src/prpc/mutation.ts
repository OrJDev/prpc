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
  type MergeRedirect,
  genQueryKey,
  tryAndWrap,
} from '@prpc/core'

export function mutation$<
  ZObj extends zod.ZodSchema | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends zod.ZodSchema ? zod.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj, ..._middlewares: Mw) {
  return (
    mutationOpts?: MergeRedirect<
      UseMutationOptions<InferReturnType<Fn>, Error, AsParam<Fn, false>>
    >
  ) => {
    const navigate = (url: string) => {
      console.log('navigate', url)
    }
    return useMutation({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) =>
        tryAndWrap(queryFn, input, navigate, true),
      ...((mutationOpts || {}) as any),
    }) as UseMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>
  }
}
