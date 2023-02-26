---
title: 'query$'
description: 'API for the query$ function'
---

**API for the query$ function**

Converts the function to be a `server$` function and will add in zod validation if there is a zod object in the 2nd argument. Return object has `useQuery` method on it from `@adeora/solid-query`.

## Examples

### Without Zod

```ts
import { query$ } from '@prpc/solid'
export const decrease = query$(
  (input) => {
    // input is inferred
    const result = input.a + input.b
    console.log(isServer)
    console.log('add', result)
    return result
  },
  () => ({
    key: 'decrease',
  })
)

// pRPC output
export const decrease = query$(
  server$((input) => {
    const result = input.a + input.b
    console.log(isServer)
    console.log('add', result)
    return result
  })
)
```

### With Zod

```ts
import { query$ } from '@prpc/solid'
import { isServer } from 'solid-js/web'
import server$ from 'solid-start/server'

export const add = query$(
  (input) => {
    const result = input.a + input.b
    console.log(isServer /* true */, server$.request)
    console.log('add', result)
    return result
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: 'add', // this will be used as the query key (along with the input), for tanstack query
  })
)

/* pRPC output
export const add = query$(
  server$((input) => {
    const schema = z.object({
      a: z.number(),
      b: z.number(),
    })
    schema.parse(input)
    const result = input.a + input.b
    console.log(isServer, server$.request)
    console.log('add', result)
    return result
  })
)
*/
```

### Client Usage

```ts
import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from 'solid-js'
import { add } from '~/server/queries'

const Query: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1)
  const addRes = add(
    () => ({
      a: num1(),
      b: 2,
    }),
    () => ({
      placeholderData: (prev) => prev,
    })
  )

  return (
    <div>
      <Suspense>
        <Switch>
          <Match when={addRes.data}>
            <div class='font-bold'>Num {addRes.data}</div>
          </Match>
          <Match when={addRes.error}>
            <div>Error</div>
          </Match>
        </Switch>
      </Suspense>
      <button onClick={() => setNum1((num) => num + 1)}>Increment</button>
    </div>
  )
}
```

## API

### Creation

```ts
export function query$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  schema: ZObj,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>

export function query$<Fn extends ExpectedFn>(
  queryFn: Fn,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>
```

- First argument is the function to be wrapped with `server$`
- Second argument can either be the zod schema or key for `@adeora/solid-query`
- Third argument is only used when the 2nd is a zod schema, and needs to be the key.

### Usage

Returns an object with `createQuery` from `@adeora/solid-query`