import { z } from 'zod'
import { query$ } from '@prpc/react-bling'

export const helloQuery = query$(
  ({ payload }) => {
    console.log('on server', payload)
    return 1
  },
  'helloQuery',
  z.string()
)
