import { query$ } from '../prpc'

export const helloQuery = query$(() => {
  console.log('on server')
  return 1
}, 'helloQuery')
