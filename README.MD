# pRPC

Write server code, query / mutate it on the server and validate inputs using zod with only few lines of code. Supporting NextJS, SolidStart and Bling.

Read more at [our docs](https://prpc.vercel.app)

pRPC currently has 3 adapters, one for NextJS, one for Bling and one for SolidStart.

## NextJS

[Read More Here Regarding NextJS](https://prpc.vercel.app/react/install)

## SolidStart

[Read More Here Regarding SolidStart](https://prpc.vercel.app/solid/install)

## Bling

[Read More Here Regarding Bling](https://prpc.vercel.app/react/install)

```tsx
import { query$ } from '@prpc/react'
import { type NextPage } from 'next'

const myQuery = query$({
  queryFn: () => {
    console.log('queryFn called on server')
    return 1
  },
  key: 'test',
})

const Home: NextPage = () => {
  const res = myQuery()
  return (
    <main className='flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]'>
      {res.data ? (
        <div className='text-5xl text-white'>thaler returned: {res.data}</div>
      ) : null}
    </main>
  )
}

export default Home
```
