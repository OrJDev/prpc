import {
  createEffect,
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from "solid-js";
import { add } from "~/server/queries";

const Query: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const addRes = add(
    () => ({
      a: num1(),
      b: "3",
    }),
    () => ({
      placeholderData: (prev) => prev,
    })
  );

  createEffect(() => console.log(JSON.parse(JSON.stringify(addRes))));

  return (
    <div class="flex flex-col gap-2 items-center my-16">
      <Suspense>
        <Switch>
          <Match when={addRes.isLoading}>Loading...</Match>
          <Match when={addRes.data}>
            <div class="font-bold">Num {addRes.data}</div>
          </Match>
          <Match when={addRes.error}>
            <div>Error</div>
          </Match>
        </Switch>
      </Suspense>
      <button
        class="border border-gray-300 p-3"
        onClick={() => setNum1((num) => num + 1)}
      >
        Increment
      </button>
    </div>
  );
};

export default Query;
