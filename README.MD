# pRPC

Write server code, query / mutate it on the server and validate inputs using zod with only few lines of code. Supporting NextJS, SolidStart and Bling.

Read more at [our docs](https://prpc.vercel.app)

pRPC currently has 3 adapters, one for NextJS, one for Bling and one for SolidStart.

```tsx
import { query$ } from '@prpc/react'
import { type NextPage } from 'next'
import { z } from 'zod'

const myQuery = query$({
  // this function will always run on the server with no additional code
  queryFn: ({ payload }) => {
    console.log('queryFn called on server ', payload)
    return payload.num / 2
  },
  key: 'testQuery',
  schema: z.object({
    num: z.number(),
  }),
})

const Home: NextPage = () => {
  const { data, isLoading } = myQuery({
    num: 3,
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

## NextJS

[Read More Here Regarding NextJS](https://prpc.vercel.app/react/install)

## SolidStart

[Read More Here Regarding SolidStart](https://prpc.vercel.app/solid/install)

## Bling

[Read More Here Regarding Bling](https://prpc.vercel.app/react/install)
