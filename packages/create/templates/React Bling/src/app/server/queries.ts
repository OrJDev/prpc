import { z } from 'zod'
import { query$ } from '@prpc/react'

export const helloQuery = query$({
  schema: z.string(),
  key: 'helloQuery',
  queryFn: ({ payload }) => {
    console.log('on server', payload)
    return 1
  },
})
