import {
  error$,
  hideRequest,
  middleware$,
  query$,
  response$,
} from '@prpc/solid'
import { z } from 'zod'
import { middleware3, myMiddleware1, myProcedure } from './middleware'

export const cleanSyntaxQuery = query$({
  queryFn: async ({ payload, request$ }) => {
    console.log('called', request$.headers.get('user-agent'), payload.isServer)
    return response$(
      { result: payload.a + payload.b },
      payload.isServer
        ? {
            headers: {
              'set-cookie': 'solid-ssr-one=true',
            },
          }
        : {}
    )
  },
  key: 'cleanSyntaxQuery',
  schema: z.object({
    a: z.number().max(5),
    b: z.number().max(10),
    isServer: z.boolean().optional(),
  }),
  middlewares: [middleware3],
})

export const authMw = middleware$(async () => {
  const session = {} as null | { user: Record<string, string> | null }
  if (!session || !session.user) {
    return error$("You can't do that!")
  }
  return {
    session: {
      ...session,
      user: session.user,
    },
  }
})

export const add = query$(
  ({ payload, ctx$ }) => {
    console.log({ ctx$: hideRequest(ctx$) })
    const result = payload.a + payload.b
    return response$(
      { result },
      {
        headers: {
          'set-cookie': 'solid-testing=1',
        },
      }
    )
  },
  'add',
  z.object({
    a: z.number().max(5),
    b: z.number().max(10),
  }),
  middleware3
)

export const decrease = query$(
  ({ payload }) => {
    const result = payload.a - payload.b
    return result
  },
  'decrease',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)

export const noInputQuery = query$(
  ({ ctx$ }) => {
    return `Hello ${ctx$.test}`
  },
  'noInputQuery',
  myMiddleware1
)

export const testReuseQuery = myProcedure.query$({
  queryFn: ({ ctx$ }) => {
    return `Hello ${ctx$.reuse}`
  },
  key: 'testReuseQuery',
})
