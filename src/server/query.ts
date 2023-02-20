import { createQuery } from "@adeora/solid-query";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query$ = <Fn extends (...args: any[]) => any>(queryFn: Fn) => {
  return {
    createQuery: (...args: Parameters<Fn>) => {
      return createQuery(() => ({
        queryKey: ["rpc", ...args],
        queryFn: () => queryFn(...args),
      }));
    },
  };
};
