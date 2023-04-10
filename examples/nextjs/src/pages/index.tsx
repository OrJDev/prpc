/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// import { query$ } from "@prpc/react";
import { mutation$, query$ } from "@prpc/react";
import { type NextPage } from "next";

const myQuery = query$({
  queryFn: () => {
    console.log("queryFn called on server");
    return 1;
  },
  key: "testQuery",
});

const myMutation = mutation$({
  mutationFn: () => {
    console.log("mutationFn called on server");
    return 1;
  },
  key: "testMut",
});

const Home: NextPage = () => {
  const res = myQuery();
  const mut = myMutation();
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {res.data ? (
        <div className="text-5xl text-white">
          query: thaler returned: {res.data}
        </div>
      ) : null}
      <button
        className="rounded-lg bg-[#ff00ff] p-4 text-2xl text-white"
        onClick={() => {
          mut.mutate();
        }}
      >
        mutate
      </button>
      {mut.data ? (
        <div className="text-5xl text-white">
          mutation: thaler returned: {mut.data}
        </div>
      ) : null}
    </main>
  );
};

export default Home;
