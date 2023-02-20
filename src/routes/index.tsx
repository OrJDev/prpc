import { createSignal, Match, Switch, type VoidComponent } from "solid-js";
import { myQueryFn } from "~/server/queries";

const Home: VoidComponent = () => {
  const [num1, setNum1] = createSignal(1);
  const myNum = myQueryFn.createQuery(num1, () => 2);
  return (
    <Switch>
      <Match when={myNum.data}>
        <div>Num {myNum.data}</div>
        <button onClick={() => setNum1((num) => num + 1)}>Increment</button>
      </Match>
      <Match when={myNum.error}>
        <div>Error</div>
      </Match>
    </Switch>
  );
};

export default Home;
