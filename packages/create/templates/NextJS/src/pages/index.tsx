import { handle$ } from "@prpc/react";
import { middleware$, query$, response$ } from "@prpc/react";
import { type GetServerSideProps, type NextPage } from "next";
import { z } from "zod";
import { queryClient } from "./_app";

const testMw = middleware$(({ request$ }) => {
  const ua = request$.headers.get("user-agent");
  console.log({ ua });
  return {
    ua,
  };
});

const myQuery = query$({
  queryFn: async ({ payload }) => {
    await new Promise((resolve) => setTimeout(resolve, 3000));
    return response$(payload.num / 2);
  },
  key: "testQuery",
  middlewares: [testMw],
  schema: z.object({
    num: z.number(),
  }),
});

export const getServerSideProps: GetServerSideProps = async (ctx) => {
  const dehydarated = await handle$({
    queryFn: myQuery,
    ctx,
    payload: {
      num: 2,
    },
    queryClient,
  });
  return {
    props: dehydarated,
  };
};

const Home: NextPage = () => {
  const { data } = myQuery(
    {
      num: 2,
    },
    {
      refetchOnMount: false,
      refetchOnWindowFocus: false,
    }
  );
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-gradient-to-b from-[#2e026d] to-[#15162c]">
      <div className="text-5xl text-white">query: {data}</div>
    </main>
  );
};

export default Home;
