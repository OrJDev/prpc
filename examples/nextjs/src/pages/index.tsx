import { query$, response$ } from "@prpc/react";
import { type NextPage } from "next";
import { z } from "zod";

const myQuery = query$({
  queryFn: async ({ payload }) => {
    return response$(payload.num / 2);
  },
  key: "testQuery",
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
        <div className="text-5xl text-white">Loading...</div>
      ) : data ? (
        <div className="text-5xl text-white">query: {data}</div>
      ) : null}
    </main>
  );
};

export default Home;
