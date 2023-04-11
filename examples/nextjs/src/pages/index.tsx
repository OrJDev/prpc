import { query$, response$ } from "@prpc/react";
import { type NextPage } from "next";
import { z } from "zod";

const myQuery = query$({
  queryFn: ({ payload, request$ }) => {
    const ua = request$.headers.get("user-agent");
    console.log("user-agent", ua);
    console.log("queryFn called on server ", payload);
    return "Hello world";
  },
  key: "testQuery",
  schema: z.object({
    num: z.number(),
  }),
});

const Home: NextPage = () => {
  const { data, isLoading } = myQuery({
    num: 3,
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
