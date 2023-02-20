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
