import {
  middleware$,
  pipe$,
  query$,
  redirect$,
  response$,
  end$,
} from '@prpc/solid'
import { z } from 'zod'

const myMiddleware1 = middleware$(() => {
  return { test: null }
})
/**
 {
    test: boolean;
} | {
    test: null;
}
 */

const middleWare2 = pipe$(myMiddleware1, (ctx) => {
  const ua = ctx.request$.headers.get('user-agent')
  console.log({ ua })
  if (ctx.test === null) {
    return end$('test is null', {
      status: 400,
    })
  }

  return {
    o: 1,
  }
})
/**
  {
    test: boolean;
    o: number;
}
 */

const middleware3 = pipe$(middleWare2, (ctx) => {
  return {
    ...ctx,
    b: 2,
  }
})
/**
  {
    b: number;
    test: boolean;
    o: number;
}
 */

export const add = query$(
  ({ payload, ctx$ }) => {
    // console.log({ ctx$ })
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
