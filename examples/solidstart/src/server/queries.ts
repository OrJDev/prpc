import { query$, queryV2$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import { z } from 'zod'

export const add = query$(
  (input) => {
    const result = input.a + input.b
    console.log(isServer /* true */)
    // console.log('req', server$.request)
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

export const decrease = query$(
  (input: { a: number; b: number }) => {
    const result = input.a - input.b
    console.log(isServer)
    console.log('add', result)
    return result
  },
  () => ({
    key: 'decrease',
  })
)

export const noInput = query$(
  () => {
    return 1
  },
  () => ({
    key: 'noInput',
  })
)

export const addV2 = queryV2$(
  ({ payload }) => {
    return payload.a + payload.b
  },
  z.object({ a: z.number(), b: z.number() }),
  'addv2'
)

export const noInputV2 = queryV2$(({ payload }) => {
  return 1
}, 'noInputv2')
