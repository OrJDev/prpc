import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from 'solid-js'
import { A, ServerError } from 'solid-start'
import { add } from '~/server/queries'

const Query: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1)

  const addRes = add(
    () => ({
      a: num1(),
      b: 3,
    }),
    () => ({
      placeholderData: (prev) => prev,
      onError: (error) => {
        // console.log({ error })
        console.log({
          new: true,
          error,
          errorMsg: error.message,
        })
      },
      retry: false,
      alwaysCSRRedirect: true,
    })
  )

  return (
    <div class='flex flex-col gap-3 px-3'>
      <div class='flex items-center gap-1'>
        <A href='/mutation'>Mutation</A>
        <A href='/query'>Query</A>
      </div>
      <Suspense fallback='Loading...'>
        <Switch>
          <Match when={addRes.error}>Error: {addRes.error?.message}</Match>
          <Match when={addRes.data}>Num: {addRes.data?.result}</Match>
        </Switch>
      </Suspense>
      <button
        class='border border-gray-300 p-3'
        onClick={() => setNum1((num) => num + 1)}
      >
        Increment
      </button>
      <pre>{addRes.error?.message ?? 'n error'}</pre>
    </div>
  )
}

export default Query
