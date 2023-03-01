import { query$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const add = query$(
  ({ payload, request$ }) => {
    const result = payload.a + payload.b
    console.log(isServer /* true */)
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

export const decrease = query$(
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
