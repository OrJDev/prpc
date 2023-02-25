---
title: "Usage"
description: "How to use pRPC"
---

**Examples**

### Query$ Server

```ts
import { query$ } from "@prpc/solid";
import { isServer } from "solid-js/web";
import server$ from "solid-start/server";

export const add = query$(
  (input) => {
    const result = input.a + input.b;
    console.log(isServer /* true */, server$.request);
    console.log("add", result);
    return result;
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: "add", // this will be used as the query key (along with the input), for tanstack query
  })
);
```

### Query$ Client

```tsx
const Query: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const addRes = add(
    () => ({
      a: num1(),
      b: 2,
    }),
    () => ({
      placeholderData: (prev) => prev,
    })
  );

  return (
    <div>
      <Suspense>
        <Switch>
          <Match when={addRes.data}>
            <div class="font-bold">Num {addRes.data}</div>
          </Match>
          <Match when={addRes.error}>
            <div>Error</div>
          </Match>
        </Switch>
      </Suspense>
      <button onClick={() => setNum1((num) => num + 1)}>Increment</button>
    </div>
  );
};
```

### Mutation$ Server

```ts
import { mutation$ } from "@prpc/solid";
import { isServer } from "solid-js/web";

export const add = mutation$(
  (input: { a: number; b: number }) => {
    const result = input.a + input.b;
    console.log(isServer);
    console.log("add", result);
    return result;
  },
  () => ({
    key: "add", // this will be used the mutation key for tanstack query
  })
);
```

### Mutation$ Client

```tsx
import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from "solid-js";
import { add } from "~/server/mutations";

const Mutation: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const mutationRes = add();
  return (
    <div>
      <Suspense>
        <Switch>
          <Match when={mutationRes.data}>
            <div>Num {mutationRes.data}</div>
          </Match>
          <Match when={mutationRes.error}>
            <div>Error</div>
          </Match>
        </Switch>
        <button onClick={() => setNum1((num) => num + 1)}>
          Increment {num1()}
        </button>
      </Suspense>
      <button
        onClick={() =>
          mutationRes.mutateAsync({
            a: num1(),
            b: 2,
          })
        }
      >
        Submit
      </button>
    </div>
  );
};
```
