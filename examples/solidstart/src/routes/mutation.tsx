import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from 'solid-js'
import { A } from 'solid-start'
import { add } from '~/server/mutations'

const Mutation: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1)
  const mutationRes = add()
  return (
    <div class='flex flex-col gap-3 px-3'>
      <div class='flex items-center gap-1'>
        <A href='/mutation'>Mutation</A>
        <A href='/query'>Query</A>
      </div>
      <Suspense>
        <Switch fallback='No submissions'>
          <Match when={mutationRes.data}>
            <div>Result: {mutationRes.data}</div>
          </Match>
          <Match when={mutationRes.error}>
            <div>Error {mutationRes.error?.message}</div>
          </Match>
          <Match when={mutationRes.isLoading}>
            <div>Loading...</div>
          </Match>
        </Switch>
        <button
          class='border border-gray-400 p-2'
          onClick={() => setNum1((num) => num + 1)}
        >
          Increment {num1()}
        </button>
      </Suspense>
      <button
        class='border border-green-400 p-2'
        onClick={() =>
          mutationRes.mutateAsync({
            a: num1(),
            b: 3,
          })
        }
      >
        Add 2
      </button>
    </div>
  )
}

export default Mutation
