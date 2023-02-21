import {
  createSignal,
  Match,
  Suspense,
  Switch,
  type VoidComponent,
} from "solid-js";
import { add } from "~/server/mutations";

const Mutation: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const solution = add.createMutation();
  return (
    <div class="flex flex-col gap-2 items-center my-16">
      <Suspense>
        <Switch>
          <Match when={solution.data}>
            <div class="font-bold">Num {solution.data}</div>
          </Match>
          <Match when={solution.error}>
            <div>Error</div>
          </Match>
        </Switch>
        <button
          class="border border-gray-300 p-3"
          onClick={() => setNum1((num) => num + 1)}
        >
          Increment {num1()}
        </button>
      </Suspense>
      <button
        onClick={() =>
          solution.mutateAsync({
            a: num1(),
            b: 2,
          })
        }
      >
        Submit
      </button>
    </div>
  );
};

export default Mutation;
