import {
  callMiddleware$,
  type ExpectedFn,
  type IMiddleware,
  type ObjectParams,
} from '@prpc/core'
import { mutation$ } from './mutation'
import { query$ } from './query'
import type zod from 'zod'

export function reuseable$<Mw extends IMiddleware[]>(...mw: Mw) {
  return {
    mw,
    callMw: async (req: Request) => await callMiddleware$(req, mw),
    query$: <
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
      params: Omit<ObjectParams<ZObj, Mw, Fn>, 'middlewares'>
    ) =>
      query$({
        ...params,
        middlewares: mw,
      }),
    mutation: mutation$,
  }
}
