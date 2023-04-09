import {
  error$,
  hideRequest,
  middleware$,
  query$,
  response$,
  reuseable$,
} from '@prpc/solid'
import { z } from 'zod'
import { middleware3, myMiddleware1 } from './middleware'

export const cleanSyntaxQuery = query$({
  queryFn: async ({ payload, request$ }) => {
    console.log('called', request$.headers.get('user-agent'))
    return { result: payload.a + payload.b }
  },
  key: 'cleanSyntaxQuery',
  schema: z.object({
    a: z.number().max(5),
    b: z.number().max(10),
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

// async function test(){
//  const obj = z.object({
//     a: z.number().max(5),
//     b: z.number().max(10),
//   })
//   const res = await obj.safeParseAsync({a: 1, b: 2})
//   if(!res.success){
//     res.error.flatten().fieldErrors;
//   }
// }
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

const reuseMw = middleware$(() => {
  return {
    reuse: 'reuse' as const,
  }
})

export const myProcedure = reuseable$(reuseMw)

export const testReuseQuery = myProcedure.query$({
  queryFn: ({ ctx$ }) => {
    return `Hello ${ctx$.reuse}`
  },
  key: 'testReuseQuery',
})
