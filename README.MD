# pRPC

Write server code in frontend files with built in colocation, middlewares, schema validation and more, everything is type safed and works with SolidStart

Read more at [our docs](https://prpc.vercel.app)

### Query Example

```ts
import { middleware$, query$, response$, error$ } from '@prpc/solid'
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

## SolidStart

[Read More Here Regarding SolidStart](https://prpc.vercel.app/solid/install)
