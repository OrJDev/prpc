import { fetch$ } from '@tanstack/bling'
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

export const t = fetch$((input: string) => {
  return `hello ${input}`
})
