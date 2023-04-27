import { isServer } from 'solid-js/web'
import type { PageEvent } from 'solid-start'

export * from './QueryProvider'
export * from './mutation'
export * from './query'
export * from '@prpc/core'
export * from './reuseable'

export const genHandleResponse = (event: PageEvent) => {
  return (response: Response) => {
    if (isServer) {
      response.headers.forEach((value, key) => {
        if (key === 'content-type') return
        event.responseHeaders.set(key, value)
      })
      if (response.status !== undefined) {
        event.setStatusCode(response.status)
      }
    }
  }
}
