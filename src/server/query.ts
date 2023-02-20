import { createQuery } from "@adeora/solid-query";

type RemapParams<T> = () => T;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query$ = <Fn extends (...args: any[]) => any>(queryFn: Fn) => {
  return {
    createQuery: <Params = Parameters<Fn>>(...args: RemapParams<Params>[]) => {
      return createQuery(() => ({
        queryKey: ["rpc", ...args.map((a) => a())],
        queryFn: () => queryFn(...args.map((a) => a())),
      }));
    },
  };
};
