import { mutation$ } from '@prpc/solid'
import { z } from 'zod'
import { myProcedure } from './middleware'

export const add = mutation$(
  async ({ payload }) => {
    // eslint-disable-next-line promise/param-names
    await new Promise((res) => setTimeout(res, 250))
    const result = payload.a + payload.b
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

export const cleanSyntaxMutation = mutation$({
  mutationFn: ({ payload }) => {
    const result = payload.a - payload.b
    return result
  },
  key: 'cleanSyntaxMutation',
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
})

export const testReuseMutation = myProcedure.mutation$({
  mutationFn: ({ payload, ctx$ }) => {
    return `${payload.a - payload.b}: ${ctx$.reuse}`
  },
  key: 'testReuseMutation',
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
})
