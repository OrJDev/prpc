import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from 'solid-js'
import { A } from 'solid-start'
import { cleanSyntaxQuery } from '~/server/queries'

const Query: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1)

  const addRes = cleanSyntaxQuery(
    () => ({
      a: num1(),
      b: 3,
    }),
    () => ({
      placeholderData: (prev) => prev,
      onError: (error) => {
        if (error.isZodError()) {
          const fieldErrors = error.cause.fieldErrors
          console.log(fieldErrors.a)
          console.log(fieldErrors.b)
        }
      },
      retry: false,
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
          <Match when={addRes.data}>Result: {addRes.data?.result}</Match>
        </Switch>
      </Suspense>
      <button
        class='border border-gray-300 p-3'
        onClick={() => setNum1((num) => num + 1)}
      >
        {num1()} - Increment
      </button>
      <pre>{addRes.error?.message ?? 'n error'}</pre>
    </div>
  )
}

export default Query
