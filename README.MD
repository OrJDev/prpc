# pRPC

Write server code, query / mutate it on the server and validate inputs using zod with only few lines of code. Supporting SolidStart and Bling.

Read more at [our docs](https://prpc.vercel.app)

pRPC currently has 2 adapters, one for Bling and one for SolidStart.

## Bling

[Read More Here Regarding Bling](https://prpc.vercel.app/react/install)

## SolidStart

[Read More Here Regarding SolidStart](https://prpc.vercel.app/solid/install)

### Further Reading - SolidStart

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
