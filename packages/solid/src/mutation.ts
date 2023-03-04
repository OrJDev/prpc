/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from '@adeora/solid-query'
import { useNavigate } from 'solid-start'
import type { z, ZodObject } from 'zod'
import type { IMiddleware } from './types'
import type {
  FCreateMutationOptions,
  ModifQueryOptions,
  InferReturnType,
  ExpectedFn,
  AsParam,
} from './types'
import { genQueryKey, tryAndWrap } from './utils'

export function mutation$<
  ZObj extends ZodObject<any> | undefined,
  Mw extends IMiddleware[],
  Fn extends ExpectedFn<
    ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined,
    Mw
  >
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj, ..._middlewares: Mw | Mw[]) {
  return (
    mutationOpts?: ModifQueryOptions<
      FCreateMutationOptions<InferReturnType<Fn>, Error, AsParam<Fn, false>>
    >
  ) => {
    const navigate = useNavigate()
    return createMutation(() => ({
      mutationKey: genQueryKey(key, undefined, true),
      mutationFn: (input: AsParam<Fn, false>) =>
        tryAndWrap(
          queryFn,
          input,
          navigate,
          mutationOpts?.()?.alwaysCSRRedirect
        ),
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>
  }
}
