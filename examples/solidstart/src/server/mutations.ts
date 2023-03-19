import { mutation$, redirect$ } from '@prpc/solid'
import { z } from 'zod'

export const add = mutation$(
  async ({ payload }) => {
    // eslint-disable-next-line promise/param-names
    await new Promise((res) => setTimeout(res, 250))
    const result = payload.a + payload.b
    if (result === 10) {
      return redirect$('/reached-10')
    }
    return result
  },
  'add',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)

export const decrease = mutation$(
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

export const noInput = mutation$(() => {
  return 1
}, 'decrease')
