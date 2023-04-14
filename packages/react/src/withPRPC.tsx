/* eslint-disable solid/reactivity */
/* eslint-disable @typescript-eslint/no-explicit-any */
import type { DehydratedState, QueryClient } from '@tanstack/react-query'
import type { ComponentType } from 'react'
import QueryProvider, { Hydrate } from './QueryProvider'

type NextComponentType<
  Context,
  InitialProps = unknown,
  Props = unknown
> = ComponentType<Props> & {
  /**
   * Used for initial page load data population. Data returned from `getInitialProps` is serialized when server rendered.
   * Make sure to return plain `Object` without using `Date`, `Map`, `Set`.
   * @param context Context of `page`
   */
  getInitialProps?(context: Context): InitialProps | Promise<InitialProps>
}

export function withPRPC(
  queryClient: QueryClient,
  AppOrPage: NextComponentType<any, any, any>
) {
  const innerWithPRPC = (props: any) => {
    const hydratedState: DehydratedState | undefined =
      props?.pageProps?.prpcState
    return (
      <QueryProvider queryClient={queryClient}>
        <Hydrate state={hydratedState}>
          <AppOrPage {...props} />
        </Hydrate>
      </QueryProvider>
    )
  }
  const displayName = AppOrPage.displayName || AppOrPage.name || 'Component'
  innerWithPRPC.displayName = `innerWithPRPC(${displayName})`
  return innerWithPRPC
}
