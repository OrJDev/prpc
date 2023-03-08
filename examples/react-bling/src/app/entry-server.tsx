import { hasHandler, handleEvent } from '@tanstack/bling/server'
import type { APIContext } from 'astro'
// @ts-expect-error idc
import * as ReactDOM from 'react-dom/server.browser'
import { App } from './root'

export const requestHandler = async ({ request }: APIContext) => {
  // manifest['entry-client'] = 1
  if (hasHandler(new URL(request.url).pathname)) {
    return await handleEvent({
      request,
    })
  }

  return new Response(await ReactDOM.renderToReadableStream(<App />), {
    headers: {
      'content-type': 'text/html',
    },
  })
}
