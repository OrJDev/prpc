# pRPC

Write server code, query / mutate it on the server and validate inputs using zod with only few lines of code. Supporting SolidStar and Bling.

Read more at [our docs](https://prpc.vercel.app)

### Install

pnpm

```sh
pnpm add @prpc/solid@latest @adeora/solid-query@latest
```

yarn

```sh
yarn add @prpc/solid@latest @adeora/solid-query@latest
```

npm

```sh
npm install @prpc/solid@latest @adeora/solid-query@latest
```

### Vite Plugin

Add the following to your vite config

```ts
import prpc from '@prpc/solid';
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
