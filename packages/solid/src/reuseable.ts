/* eslint-disable @typescript-eslint/no-explicit-any */
import {
  callMiddleware$,
  getParams,
  type ExpectedFn,
  type IMiddleware,
  type ObjectParams,
} from '@prpc/core'
import { type ExpectedMutationReturn, mutation$ } from './mutation'
import { type ExpectedQueryReturn, query$ } from './query'
import type zod from 'zod'

export function reuseable$<Mw extends IMiddleware[]>(...mw: Mw) {
  return {
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
      params: Omit<ObjectParams<ZObj, Mw, Fn>, 'middlewares'>,
      ...rest: any[]
    ): ExpectedQueryReturn<Mw, Fn, ZObj> => {
      const { queryFn, key } =
        typeof params === 'object'
          ? params
          : getParams(false, [params, ...rest])
      return (query$ as any)(queryFn, key, ...mw)
    },
    mutation$: <
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
      params: Omit<ObjectParams<ZObj, Mw, Fn, true>, 'middlewares'>,
      ...rest: any[]
    ): ExpectedMutationReturn<Mw, Fn, ZObj> => {
      let queryFn
      let key
      if (typeof params === 'object') {
        queryFn = params.mutationFn
        key = params.key
      } else {
        const temp = getParams(true, [params, ...rest])
        queryFn = temp.queryFn
        key = temp.key
      }
      return (mutation$ as any)(queryFn, key, ...mw)
    },
  }
}
