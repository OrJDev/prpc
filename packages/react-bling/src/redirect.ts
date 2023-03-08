import { redirect } from '@tanstack/bling/server'

export const redirect$ = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return redirect(url, init) as any
}

export function handleRedirect(
  url: string,
  navigate: (url: string, opts: { replace: boolean }) => void
) {
  navigate(url, {
    replace: true,
  })
}
