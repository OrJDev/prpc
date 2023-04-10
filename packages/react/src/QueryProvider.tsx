/* eslint-disable solid/no-destructure */
import { QueryClientProvider, type QueryClient } from '@tanstack/react-query'

const QueryProvider: React.FC<{
  children: React.ReactNode
  queryClient: QueryClient
}> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider
