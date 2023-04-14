/* eslint-disable solid/no-destructure */
import {
  QueryClientProvider,
  type QueryClient,
  type HydrateProps,
  Hydrate as ReactQueryHydrate,
} from '@tanstack/react-query'

const QueryProvider: React.FC<{
  children: React.ReactNode
  queryClient: QueryClient
}> = ({ children, queryClient }) => {
  return (
    <QueryClientProvider client={queryClient}>{children}</QueryClientProvider>
  )
}

export default QueryProvider

export const Hydrate: React.FC<HydrateProps> = (props) => {
  return <ReactQueryHydrate {...props} />
}
