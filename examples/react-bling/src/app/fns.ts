import { z } from 'zod'
import { query$, mutation$ } from '@prpc/react-bling'

export const helloQuery = query$(
  ({ payload }) => {
    console.log('on server', payload)
    return 1
  },
  'helloQuery',
  z.string()
)

export const helloMutation = mutation$(
  ({ request$, payload }) => {
    const ua = request$.headers.get('user-agent')
    console.log({ ua, payload })
    return `hello testing`
  },
  'helloMutation',
  z.string()
)
