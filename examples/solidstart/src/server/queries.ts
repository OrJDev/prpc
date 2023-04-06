import {
  error$,
  hideRequest,
  middleware$,
  pipe$,
  query$,
  response$,
} from '@prpc/solid'
import { z } from 'zod'

const myMiddleware1 = middleware$(({ request$ }) => {
  console.log('ua', request$.headers.get('user-agent'))
  const random = Math.random()
  // change to `tes` to test for error
  const test = random > 0.5 ? 'test' : null
  console.log({ test })
  return { test }
})
export const cleanSyntaxQuery = query$(
  {
    queryFn: async ({ payload, request$, ctx$ }) => {
      console.log('called', request$.headers.get('user-agent'))
      return { result: payload.a + payload.b }
    },
    key: 'cleanSyntaxQuery',
    schema: z.object({
      a: z.number().max(5),
      b: z.number().max(10),
    }),
  },
  myMiddleware1
)

const middleWare2 = pipe$(myMiddleware1, (ctx) => {
  if (!ctx.test || ctx.test === 'tes') {
    return error$(`Expected test to be "test" but got ${ctx.test}`)
  }
  return {
    test: ctx.test,
    o: 1,
  }
})

const middleware3 = pipe$(middleWare2, (ctx) => {
  return {
    ...ctx,
    b: 2,
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
