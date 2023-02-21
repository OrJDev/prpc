# pRPC

Write simple and interactive SolidStart code that will run on the server but will easily be used on the client.

## Queries

### Server Function

```ts
import { query$ } from "prpc";
import { isServer } from "solid-js/web";

export const add = query$((input: { a: number; b: number }) => {
  const result = input.a + input.b;
  console.log(isServer); // true
  console.log("add", result);
  return result;
});
```

### Client

```tsx
import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from "solid-js";
import { add } from "~/server/queries";

const Home: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const solution = add.createQuery(() => ({
    a: num1(),
    b: 2,
  }));
  return (
    <Suspense>
      <Switch>
        <Match when={solution.data}>
          <div class="font-bold">Num {solution.data}</div>
          <button
            class="border border-gray-300 p-3"
            onClick={() => setNum1((num) => num + 1)}
          >
            Increment
          </button>
        </Match>
        <Match when={solution.error}>
          <div>Error</div>
        </Match>
      </Switch>
    </Suspense>
  );
};

export default Home;
```

## Mutations

### Server Function

```ts
import { mutation$ } from "prpc";
import { isServer } from "solid-js/web";

export const add = mutation$((input: { a: number; b: number }) => {
  const result = input.a + input.b;
  console.log(isServer); // true
  console.log("add", result);
  return result;
});
```

### Client

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
  const solution = add.createMutation();
  return (
    <Suspense>
      <Switch>
        <Match when={solution.data}>
          <div class="font-bold">Num {solution.data}</div>
        </Match>
        <Match when={solution.error}>
          <div>Error</div>
        </Match>
      </Switch>
      <button
        class="border border-gray-300 p-3"
        onClick={() => setNum1((num) => num + 1)}
      >
        Increment {num1()}
      </button>
      <button
        onClick={() =>
          solution.mutateAsync({
            a: num1(),
            b: 2,
          })
        }
      >
        Submit
      </button>
    </Suspense>
  );
};

export default Mutation;
```

This project was created using [Create JD App](https://github.com/OrJDev/create-jd-app)

## Start Dev Server

```bash
pnpm dev
```

This will start a dev server on port `3000` and will watch for changes.

## Testing Production Build

### Build

```bash
pnpm build
```

### Start

```bash
pnpm start
```

This will start a production server on port `3000`.

### Enviroment Variables

[Sponsor Create JD App](https://github.com/sponsors/OrJDev)
