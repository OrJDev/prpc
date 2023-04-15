import { QueryProvider } from '@prpc/solid'
import { QueryClient } from '@tanstack/solid-query'
import { Suspense, useContext } from 'solid-js'
import { HydrationScript, NoHydration } from 'solid-js/web'
import { manifestContext } from './manifest'
import { helloQuery } from './server/queries'
import { helloMutation } from './server/mutations'

function ServerQueryHello() {
  const helloRes = helloQuery('testing')
  return (
    <Suspense fallback={<p>Loading...</p>}>
      <div>{helloRes.data}</div>
    </Suspense>
  )
}

function ServerMutationHello() {
  const helloMut = helloMutation()
  return (
    <div>
      <button onClick={() => helloMut.mutateAsync('from astro')}>
        Click me
      </button>
      <div>{helloMut.isLoading ? 'Loading...' : helloMut.data}</div>
    </div>
  )
}

export function App() {
  const queryClient = new QueryClient()
  return (
    <html>
      <head>
        <title>Hello World</title>
      </head>
      <body>
        <QueryProvider queryClient={queryClient}>
          <ServerQueryHello />
          <ServerMutationHello />
        </QueryProvider>
        <Scripts />
      </body>
    </html>
  )
}

function Scripts() {
  const manifest = useContext(manifestContext)
  return (
    <NoHydration>
      <HydrationScript />
      {import.meta.env.DEV ? (
        <>
          <script type='module' src='/@vite/client' $ServerOnly></script>
          <script
            type='module'
            src='/src/app/entry-client.tsx'
            $ServerOnly
          ></script>
        </>
      ) : (
        <>
          <script
            type='module'
            src={manifest['entry-client']}
            $ServerOnly
          ></script>
        </>
      )}
    </NoHydration>
  )
}
