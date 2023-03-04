# pRPC

Write server code, query / mutate it on the server and validate inputs using zod with only few lines of code. Supporting SolidStart and Bling.

Read more at [our docs](https://prpc.vercel.app)

### Install

```sh
pnpm add @prpc/solid@latest @prpc/vite@latest @adeora/solid-query@latest
```

### Vite Plugin

Add the following to your vite config:

```ts
import prpc from '@prpc/vite';
import solid from 'solid-start/vite';
...
export default defineConfig(() => {
  return {
    ...
    plugins: [
      prpc(), // Important that this plugin runs before the solid one!
      solid()
    ]
    ...
  }
})
```

### QueryProvider

```tsx
// @refresh reload
import { QueryProvider } from '@prpc/solid'
import { Suspense } from 'solid-js'
import {
  Body,
  ErrorBoundary,
  FileRoutes,
  Head,
  Html,
  Link,
  Meta,
  Routes,
  Scripts,
  Title,
} from 'solid-start'

export default function Root() {
  return (
    <Html lang='en'>
      <Head>
        <Title>pRPC Basic</Title>
        <Meta charset='utf-8' />
        <Meta name='viewport' content='width=device-width, initial-scale=1' />
        <Meta name='theme-color' content='#026d56' />
        <Meta name='description' content='pRPC Basic example' />
        <Link rel='icon' href='/favicon.ico' />
      </Head>
      <Body>
        <QueryProvider>
          <Suspense>
            <ErrorBoundary>
              <Routes>
                <FileRoutes />
              </Routes>
            </ErrorBoundary>
          </Suspense>
        </QueryProvider>
        <Scripts />
      </Body>
    </Html>
  )
}
```

### Further Reading

<img width="875" alt="Screenshot 2023-03-03 at 8 29 59" src="https://user-images.githubusercontent.com/91349014/222648058-3e0d5c2a-0c93-4b35-a673-f0955fb94f99.png">

The code in this image is

```ts
import { query$ } from '@prpc/solid'
import { z } from 'zod'

export const helloQuery = query$(
  ({ payload, request$ }) => {
    console.log(request$.headers.get('user-agent'))
    return `server says hello: ${payload.name}`
  },
  'hello',
  z.object({ name: z.string() })
)
```

But how is this code working / running on the server? request$ is not an actual thing and you cannot use closures.
We use a babel plugin built on top of vite that is meant to wrap functions that passed to query$ with server, so for instance:

```ts
query$(myFn)
```

becomes

```ts
query$(server$(myFn))
```

This piece of code make the function run on the server, but how do we access the request?

Well as you know request$ is not an actual thing in in SolidStart, this is again where our babel plugin helps, we pass an empty object to this function called request$ and then our babel plugin makes sure to replace all request$ acccess with server$.request (which is a way to get the request in SolidStart)

So for instance:

```ts
query$(({ request$ }) => {
  const headers = request$.headers
})
```

becomes

```ts
query$(
  server$(() => {
    const headers = server$.request.headers
  })
)
```

How do i call this function from the client?

query$ returns: `(...) => createQuery(...)`
So what it does is, it is taking the function that is running on the server (wrapped with server$) and basically try to query it using `createQuery` from solid query.

So:

```ts
const myQuery = query$(myFn)
```

Can be used client side (still will run on the server):

```ts
const queryRes = myQuery(() => input)

// queryRes is basically tanstack query
queryRes.isLoading
queryRes.data
```
