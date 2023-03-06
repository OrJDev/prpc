/* eslint-disable @typescript-eslint/no-explicit-any */
import type { ZodObject, z } from 'zod'
import { mutation$ } from './mutation'
import { query$ } from './query'
import type { ExpectedFn, IMiddleware } from './types'

export const procedure$ = <Mw extends IMiddleware[]>(...mw: Mw | Mw[]) => {
  return {
    query$: <
      ZObj extends ZodObject<any> | undefined,
      Fn extends ExpectedFn<
        ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined,
        Mw
      >
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    >(
      queryFn: Fn,
      key: string,
      _schema?: ZObj
    ) => {
      return query$(queryFn, key, _schema, ...mw)
    },
    mutation$: <
      ZObj extends ZodObject<any> | undefined,
      Mw extends IMiddleware[],
      Fn extends ExpectedFn<
        ZObj extends ZodObject<any> ? z.infer<ZObj> : undefined,
        Mw
      >
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    >(
      queryFn: Fn,
      key: string,
      _schema?: ZObj
    ) => {
      return mutation$(queryFn, key, _schema)
    },
  }
}
