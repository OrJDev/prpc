# pRPC

Write server code in frontend files with built in colocation, middlewares, schema validation and more, everything is type safed and works with NextJS, Bling and SolidStart

Read more at [our docs](https://prpc.vercel.app)

pRPC currently has 3 adapters, one for NextJS, one for Bling and one for SolidStart, it has a [trpc](https://github.com/trpc/trpc) like API, except it using `server$` under the hood which allows colocation (server code in frontend files)

### Query Example

```ts
import { middleware$, query$, response$, error$ } from '@prpc/react'
import { z } from 'zod'

const testMw = middleware$(async ({ request$ }) => {
  const ua = request$.headers.get('user-agent')
  console.log('middleware called on server ', ua)
  if (ua?.includes('bot')) {
    return error$('Bots are not allowed')
  }
  return {
    ua,
  }
})

const myQuery = query$({
  queryFn: ({ request$, ctx$, payload }) => {
    console.log(
      'queryFn called on server ',
      ctx$.ua === request$.headers.get('user-agent'),
      payload
    )
    return response$(payload.num / 2)
  },
  key: 'testQuery',
  middlewares: [testMw],
  schema: z.object({
    num: z.number(),
  }),
})
```

## NextJS

[Read More Here Regarding NextJS](https://prpc.vercel.app/nextjs/install)

## SolidStart

[Read More Here Regarding SolidStart](https://prpc.vercel.app/solid/install)

## Bling

[Read More Here Regarding Bling](https://prpc.vercel.app/react/install)

### Full Page Colocation Example - NextJS

How would this look like (NextJS example):

```tsx
import { middleware$, query$, response$, error$ } from '@prpc/react'
import { type NextPage } from 'next'
import { z } from 'zod'

const testMw = middleware$(async ({ request$ }) => {
  const ua = request$.headers.get('user-agent')
  console.log('middleware called on server ', ua)
  if (ua?.includes('bot')) {
    return error$('Bots are not allowed')
  }
  return {
    ua,
  }
})

const myQuery = query$({
  queryFn: ({ request$, ctx$, payload }) => {
    console.log(
      'queryFn called on server ',
      ctx$.ua === request$.headers.get('user-agent'),
      payload
    )
    return response$(payload.num / 2)
  },
  key: 'testQuery',
  middlewares: [testMw],
  schema: z.object({
    num: z.number(),
  }),
})

const Home: NextPage = () => {
  const { data, isLoading } = myQuery({
    num: 2,
  })

  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      {isLoading ? (
        <p className='text-xl font-bold text-white'>Loading...</p>
      ) : data ? (
        <div className='text-5xl text-white'>query: {data}</div>
      ) : null}
    </main>
  )
}

export default Home
```
