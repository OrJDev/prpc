import { redirect } from 'solid-start'

export const response$ = <T>(value: T, init?: ResponseInit): T => {
  return new Response(
    typeof value === 'string' ? value : JSON.stringify(value),
    init
  ) as unknown as T
}

export const redirect$ = (
  url: string,
  init?: number | ResponseInit
): undefined => {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return redirect(url, init) as any
}
