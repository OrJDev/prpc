import { QueryClient, QueryClientProvider } from '@tanstack/solid-query'
import type { ParentComponent } from 'solid-js'

export const QueryProvider: ParentComponent<{
  queryClient?: QueryClient
}> = (props) => {
  const queryClient = () => props.queryClient ?? new QueryClient()
  return (
    <QueryClientProvider client={queryClient()}>
      {props.children}
    </QueryClientProvider>
  )
}
