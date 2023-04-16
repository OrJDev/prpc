/* eslint-disable @typescript-eslint/no-explicit-any */
import type { AsParam, InferReturnType } from '@prpc/core'
import { QueryClient, type QueryClientConfig } from '@tanstack/react-query'
import type { query$ } from './query'

export * from './mutation'
export * from './query'
export * from '@prpc/core'
export { default as QueryProvider, Hydrate } from './QueryProvider'
export * from './withPRPC'

export function nextApiRequestToNodeRequest(req: any) {
  const protocol = req.headers['x-forwarded-proto'] || 'http'
  const host = req.headers['x-forwarded-host'] || req.headers.host
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  const actualUrl = new URL(req.url as string, `${protocol}://${host}`)
  return new Request(actualUrl, req as unknown as Request)
}

export const createPrpcQueryClient = (cfg?: QueryClientConfig) =>
  new QueryClient(cfg)

export async function handle$<
  Fn extends ReturnType<typeof query$>,
  QClient extends QueryClient | undefined = undefined
>(input: {
  ctx: { req: any; res: any }
  queryFn: Fn
  payload: AsParam<Fn>
  queryClient?: QClient
}): Promise<
  QClient extends QueryClient
    ? InferReturnType<Fn['fullyDehydrate']>
    : InferReturnType<Fn['callRaw']>
> {
  const getInput = (payload: any) => {
    if (typeof payload === 'object' && typeof payload.payload === 'string') {
      return payload
    }
    return {
      payload: payload
        ? typeof payload === 'string'
          ? payload
          : JSON.stringify(payload)
        : '',
    }
  }
  const newFn = async (payload: any) => {
    let res = await input.queryFn.callRaw(
      getInput(payload),
      // @ts-expect-error all good
      {
        headers: new Headers(input.ctx.req.headers),
        method: input.ctx.req.method,
        url: input.ctx.req.url,
      }
    )
    if (res instanceof Response && input.ctx.res) {
      res.headers.forEach((v, k) => {
        if (k === 'content-type') return
        input.ctx.res.setHeader(k, v)
      })
      input.ctx.res.statusCode = res.status
      res = await res.json()
    }
    return res
  }
  if (input.queryClient) {
    return (await input.queryFn.fullyDehydrate(
      input.queryClient,
      input.payload,
      newFn
    )) as any
  }
  return await newFn(input.payload)
}
