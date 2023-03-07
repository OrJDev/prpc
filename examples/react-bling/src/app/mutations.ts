// import { fetch$ } from '@tanstack/bling/server'
import { z } from 'zod'
import { mutation$ } from '../prpc'

export const helloMutation = mutation$(
  ({ request$, payload }) => {
    const ua = request$.headers.get('user-agent')
    console.log({ ua, payload })
    return `hello testing`
  },
  'helloMutation',
  z.string()
)

// export const testing = fetch$((g, a) => {
//   return '1'
// })
