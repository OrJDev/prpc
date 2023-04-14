import { middleware$, query$, response$ } from "@prpc/react";
import { type NextPage } from "next";
import { z } from "zod";

const testMw = middleware$(async ({ request$ }) => {
  const ua = request$.headers.get("user-agent");
  console.log("middleware called on server ", ua);
  return {
    ua,
  };
});

const myQuery = query$({
  queryFn: ({ request$, ctx$, payload }) => {
    console.log(
      "queryFn called on server ",
      ctx$.ua === request$.headers.get("user-agent"),
      payload
    );
    return response$(payload.num / 2);
  },
  key: "testQuery",
  middlewares: [testMw],
  schema: z.object({
    num: z.number(),
  }),
});

const Home: NextPage = () => {
  const { data, isLoading } = myQuery({
    num: 2,
  });

  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      {isLoading ? (
        <p className="text-xl font-bold text-white">Loading...</p>
      ) : data ? (
        <div className="text-5xl text-white">query: {data}</div>
      ) : null}
    </main>
  );
};

export default Home;
