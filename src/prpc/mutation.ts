import { createMutation, type CreateMutationResult } from "@adeora/solid-query";
import type { AsParam, InferReturnType } from "./types";
import { unwrapValue } from "./utils";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const mutation$ = <Fn extends (input: any) => any>(fn: Fn) => {
  return {
    createMutation: (): CreateMutationResult<
      InferReturnType<Fn>,
      Error,
      AsParam<Fn, false>
    > =>
      createMutation(() => ({
        mutationFn: (input) => fn(unwrapValue(input)),
      })),
  };
};
