import { query$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const add = query$(
  (input) => {
    const result = input.a + input.b
    console.log(isServer /* true */)
    console.log('add', result)
    return result
  },
  'add',
  z.object({
    a: z.number(),
    b: z.number(),
  })
)

export const decrease = query$(
  (input: { a: number; b: number }) => {
    const result = input.a - input.b
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
