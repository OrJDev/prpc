import { query$ } from '@prpc/solid'
import { z } from 'zod'

export const helloQuery = query$({
  schema: z.object({ name: z.string() }),
  key: 'hello',
  queryFn: ({ payload }) => {
    return `server says hello: ${payload.name}`
  },
})
