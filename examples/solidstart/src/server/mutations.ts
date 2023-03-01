import { mutation$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const add = mutation$(
  async ({ payload, request$ }) => {
    // eslint-disable-next-line promise/param-names
    await new Promise((res) => setTimeout(res, 250))
    const result = payload.a + payload.b
    console.log(isServer)
    console.log('add', result)
    console.log(request$.headers.get('user-agent'))
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
    console.log(isServer)
    console.log('add', result)
    return result
  },
  'decrease',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)
