import React, { useContext } from 'react'
import { helloMutation, helloQuery } from './fns'
import { manifestContext } from './manifest'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

function ServerQueryHello() {
  const { isLoading, data } = helloQuery('testing')
  return (
    <div>
      <div>{isLoading ? 'Loading...' : data}</div>
    </div>
  )
}

function ServerMutationHello() {
  const { isLoading, data, mutateAsync } = helloMutation()
  return (
    <div>
      <button onClick={() => mutateAsync('from astro')}>Click me</button>
      <div>{isLoading ? 'Loading...' : data}</div>
    </div>
  )
}

export function App() {
  const [queryClient] = React.useState(() => new QueryClient())
  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <QueryClientProvider client={queryClient}>
          <ServerQueryHello />
          <ServerMutationHello />
        </QueryClientProvider>
        <Scripts />
      </body>
    </html>
  )
}

function Scripts() {
  const manifest = useContext(manifestContext)
  return import.meta.env.DEV ? (
    <>
      <script type='module' src='/@vite/client'></script>
      <script type='module' src='/src/app/entry-client.tsx'></script>
    </>
  ) : (
    <>
      <script type='module' src={manifest['entry-client']}></script>
    </>
  )
}
