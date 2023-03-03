import { query$, redirect, replyWith } from '@prpc/solid'
import { z } from 'zod'

export const add = query$(
  ({ payload }) => {
    const result = payload.a + payload.b
    if (result === 10) {
      return redirect('/test')
    }
    return replyWith(result, {
      headers: {
        'set-cookie': 'solid-testing=1',
      },
    })
  },
  'add',
  z.object({
    a: z.number(),
    b: z.number(),
  })
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
