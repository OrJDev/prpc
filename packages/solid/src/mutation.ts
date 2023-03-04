/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from '@adeora/solid-query'
import { useNavigate } from 'solid-start'
import type { z, ZodObject } from 'zod'
import type { FCreateMutationOptions, ModifQueryOptions } from './types'
import type { InferReturnType, ExpectedFn, AsParam } from '@prpc/core/types'
import { genQueryKey, tryAndWrap } from '@prpc/core/utils'

export function mutation$<
  ZObj extends ZodObject<any> | undefined,
  Fn extends ExpectedFn<ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined>
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
>(queryFn: Fn, key: string, _schema?: ZObj) {
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
