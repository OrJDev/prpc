import { z } from 'zod'
import { mutation$ } from '@prpc/react'

export const helloMutation = mutation$({
  schema: z.string(),
  key: 'helloMutation',
  mutationFn: ({ request$, payload }) => {
    const ua = request$.headers.get('user-agent')
    console.log({ ua, payload })
    return `hello testing`
  },
})
