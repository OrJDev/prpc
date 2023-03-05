import { middleware$, pipe$, query$, redirect$, response$ } from '@prpc/solid'
import { z } from 'zod'

const myMiddleware1 = middleware$(({ request$ }) => {
  console.log('req', request$)
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
    console.log({ ctx$ })
    const result = payload.a + payload.b
    if (result === 10) {
      return redirect$('/reached-10')
    }
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
    a: z.number(),
    b: z.number(),
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
