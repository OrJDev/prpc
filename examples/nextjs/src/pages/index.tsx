/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable @typescript-eslint/no-unsafe-argument */
// import { query$ } from "@prpc/react";
import { mutation$, query$ } from "@prpc/react";
import { type NextPage } from "next";
import { z } from "zod";

const myQuery = query$({
  queryFn: () => {
    console.log("queryFn called on server");
    return 1;
  },
  key: "testQuery",
});

const myMutation = mutation$({
  mutationFn: ({ payload }) => {
    return {
      result: payload.a + payload.b,
    };
  },
  schema: z.object({
    a: z.number(),
    b: z.number(),
  }),
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
          mut.mutate({
            a: 1,
            b: 2,
          });
        }}
      >
        mutate
      </button>
      {mut.data ? (
        <div className="text-5xl text-white">
          mutation: thaler returned: {mut.data.result}
        </div>
      ) : null}
    </main>
  );
};

export default Home;
