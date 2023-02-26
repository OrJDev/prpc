import { mutation$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const add = mutation$(
  async (input: { a: number; b: number }) => {
    // eslint-disable-next-line promise/param-names
    await new Promise((res) => setTimeout(res, 250))
    const result = input.a + input.b
    console.log(isServer)
    console.log('add', result)
    return result
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: 'add',
  })
)

export const decrease = mutation$(
  (input) => {
    const result = input.a + input.b
    console.log(isServer)
    console.log('add', result)
    return result
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: 'decrease',
  })
)
