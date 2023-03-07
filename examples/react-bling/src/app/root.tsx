import React from 'react'
import { QueryClientProvider, QueryClient } from '@tanstack/react-query'
import { helloQuery } from './queries'
import { helloMutation } from './mutations'

function ServerQueryHello() {
  const { isLoading, data } = helloQuery()
  return (
    <div className='flex flex-col gap-2 items-center'>
      <div>{isLoading ? 'Loading...' : data}</div>
    </div>
  )
}

function ServerMutationHello() {
  const { isLoading, data, mutateAsync } = helloMutation()
  return (
    <div className='flex flex-col gap-2 items-center'>
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
  return import.meta.env.DEV ? (
    <>
      <script type='module' src='/@vite/client'></script>
      <script type='module' src='/src/app/entry-client.tsx'></script>
    </>
  ) : null
}
