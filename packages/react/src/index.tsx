export * from './mutation'
export * from './query'
export * from '@prpc/core'
export { default as QueryProvider, Hydrate } from './QueryProvider'
export * from './withPRPC'

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function nextApiRequestToNodeRequest(req: any) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const actualUrl = new URL(req.url as string, `${protocol}://${host}`)
  return new Request(actualUrl, req as unknown as Request)
}
