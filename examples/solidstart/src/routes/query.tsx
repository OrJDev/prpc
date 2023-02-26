import {
  createEffect,
  createSignal,
  Suspense,
  type VoidComponent,
} from 'solid-js'
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
    })
  )

  createEffect(() => console.log(JSON.parse(JSON.stringify(addRes))))

  return (
    <div class='flex flex-col gap-3 px-3'>
      <Suspense>
        <p class='font-bold'>
          {addRes.data ? `Num: ${addRes.data}` : 'Pending'}
        </p>
      </Suspense>
      <button
        class='border border-gray-300 p-3'
        onClick={() => setNum1((num) => num + 1)}
      >
        Increment
      </button>
    </div>
  )
}

export default Query
