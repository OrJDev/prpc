import { hideRequest, middleware$, pipe$, query$, response$ } from '@prpc/solid'
import { z } from 'zod'

const myMiddleware1 = middleware$(({ request$ }) => {
  console.log('ua', request$.headers.get('user-agent'))
  return { test: null }
})

const middleWare2 = pipe$(myMiddleware1, (ctx) => {
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
