import { Match, Switch, type VoidComponent } from "solid-js";
import { myQueryFn } from "~/server/queries";

const Home: VoidComponent = () => {
  const myNum = myQueryFn.createQuery(1, 2);
  return (
    <Switch>
      <Match when={myNum.data}>
        <div>Num {myNum.data}</div>
      </Match>
      <Match when={myNum.error}>
        <div>Error</div>
      </Match>
    </Switch>
  );
};

export default Home;
