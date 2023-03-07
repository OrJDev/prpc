import { z } from 'zod'
import { query$ } from '../prpc'

export const helloQuery = query$(
  ({ payload }) => {
    console.log('on server', payload)
    return 1
  },
  'helloQuery',
  z.string()
)
