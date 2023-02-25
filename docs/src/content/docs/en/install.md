---
title: "Install"
description: "Installing pRPC"
---

**Installing pRPC**

pnpm

```sh
pnpm add prpc@latest
```

yarn

```sh
yarn add prpc@latest
```

npm

```sh
npm install prpc@latest
```

### Adding Vite Plugin

Add the following to your vite config

```ts
import prpc from 'prpc';
import solid from 'solid-start/vite';
...
export default defineConfig(() => {
  return {
    ...
    plugins: [
      prpc(), // Important that this plugin runs before the solid one!
      solid()
    ]
    ...
  }
})
```

[Next up: Usage](/en/usage)
