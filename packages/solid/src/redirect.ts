/* eslint-disable @typescript-eslint/no-explicit-any */
import { startTransition } from 'solid-js'
import { isServer } from 'solid-js/web'
import { redirect } from 'solid-start'

export const redirect$ = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  return redirect(url, init) as any
}

export function handleRedirect(
  url: string,
  navigate: (url: string, opts: { replace: boolean }) => void
) {
  startTransition(() => {
    if (url && url.startsWith('/')) {
      navigate(url, {
        replace: true,
      })
    } else {
      if (!isServer && url) {
        window.location.href = url
      }
    }
  })
  return null
}
