# @prpc/solid

SolidSart adapter for pRPC.

### Install

```sh
pnpm add @prpc/solid@latest @prpc/vite@latest @tanstack/solid-query@beta
```

### Vite Plugin

Add the following to your vite config

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

Read more - [docs](https://prpc.vercel.app)
