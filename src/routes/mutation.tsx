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
  const mutationRes = add();
  return (
    <div>
      <Suspense>
        <Switch>
          <Match when={mutationRes.data}>
            <div>Num {mutationRes.data}</div>
          </Match>
          <Match when={mutationRes.error}>
            <div>Error</div>
          </Match>
        </Switch>
        <button onClick={() => setNum1((num) => num + 1)}>
          Increment {num1()}
        </button>
      </Suspense>
      <button
        onClick={() =>
          mutationRes.mutateAsync({
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
