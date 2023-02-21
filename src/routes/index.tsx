import { createSignal, Match, Switch, type VoidComponent } from "solid-js";
import { add } from "~/server/queries";

const Home: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const solution = add.createQuery(num1, () => 2);

  return (
    <Switch>
      <Match when={solution.data}>
        <div class="font-bold">Num {solution.data}</div>
        <button
          class="border border-gray-300 p-3"
          onClick={() => setNum1((num) => num + 1)}
        >
          Increment
        </button>
      </Match>
      <Match when={solution.error}>
        <div>Error</div>
      </Match>
    </Switch>
  );
};

export default Home;
