# pRPC

Write simple and interactive SolidStart code that will run on the server but will easily be used on the client.

## Queries

### Server Function

```ts
import { query$ } from "prpc";
export const myQueryFn = query$((a: number, b: number) => {
  const result = a + b;
  console.log("this is running on the server", result);
  return result;
});
// myQueryFn.createQuery(1, 2)
```

### Client Call

```tsx
import { Match, Switch, type VoidComponent } from "solid-js";
import { myQueryFn } from "~/server/queries";

const Home: VoidComponent = () => {
  const myNum = myQueryFn.createQuery(1, 2);
  return (
    <Switch>
      <Match when={myNum.data}>
        <div>Num {myNum.data}</div>
      </Match>
      <Match when={myNum.error}>
        <div>Error</div>
      </Match>
    </Switch>
  );
};

export default Home;
```

# Issue

Current issue is that the current regex doesn't close the `query$` function `)`, the code is invalid and will not run

## Input

```ts
import { query$ } from "./query";

export const myQueryFn = query$((a: number, b: number) => {
  const result = a + b;
  console.log("myQueryFn", result);
  return result;
});
```

## Output

```ts
import server$ from "solid-start/server";
import { query$ } from "./query";

export const myQueryFn = query$(server$((a: number, b: number) => {
  const result = a + b;
  console.log("myQueryFn", result);
  return result;
}); // -> missing ) before the ;
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
