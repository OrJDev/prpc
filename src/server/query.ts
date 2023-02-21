import { createQuery, type CreateQueryResult } from "@adeora/solid-query";
import type { InferReturnType, ValueOrAccessor } from "./types";
import { unwrapValue } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const query$ = <Fn extends (input: any) => any>(queryFn: Fn) => {
  return {
    createQuery: <Params extends Parameters<Fn> = Parameters<Fn>>(
      input: ValueOrAccessor<Params[0]>
    ): CreateQueryResult<InferReturnType<Fn>> => {
      const innerArgs = () => unwrapValue(input);
      return createQuery(() => ({
        queryKey: ["rpc", innerArgs()],
        queryFn: () => queryFn(innerArgs()),
      }));
    },
  };
};
