/* eslint-disable solid/reactivity */
import { query$ } from '@prpc/solid'
import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from 'solid-js'
import { z } from 'zod'

const queryOnServer = query$({
  queryFn: async ({ payload, request$ }) => {
    console.log('on server', request$.headers.get('user-agent'))
    return { result: payload.num / 2 }
  },
  key: 'queryOnServer',
  schema: z.object({
    num: z.number().max(5),
  }),
})

const Query: VoidComponent = () => {
  const [num, setNum1] = createSignal(1)

  const queryRes = queryOnServer(
    () => ({ num: num() }),
    () => ({
      placeholderData: (prev) => prev,
      onError: (error) => {
        if (error.isZodError()) {
          const fieldErrors = error.cause.fieldErrors
          console.log(fieldErrors.num)
        }
      },
      retry: false,
    })
  )

  return (
    <div class='flex flex-col gap-3 px-3'>
      <Suspense fallback='Loading...'>
        <Switch>
          <Match when={queryRes.error}>Error: {queryRes.error?.message}</Match>
          <Match when={queryRes.data}>Result: {queryRes.data?.result}</Match>
        </Switch>
      </Suspense>
      <button
        class='border border-gray-300 p-3'
        onClick={() => setNum1((num) => num + 1)}
      >
        {num()} - Increment
      </button>
      {queryRes.error?.message && <pre>{queryRes.error?.message}</pre>}
    </div>
  )
}

export default Query
