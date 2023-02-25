/* eslint-disable @typescript-eslint/no-explicit-any */
import { createMutation, type CreateMutationResult } from "@adeora/solid-query";
import type { z, ZodObject } from "zod";
import type {
  AsParam,
  ExpectedFn,
  FCreateMutationOptions,
  InferReturnType,
  PRPCOptions,
} from "./types";
import { genQueryKey, getPRPCInput, unwrapValue } from "./utils";

export function mutation$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  schema: ZObj,
  opts?: () => PRPCOptions
): (
  mutationOpts?: FCreateMutationOptions<InferReturnType<Fn>>
) => CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>;

export function mutation$<Fn extends ExpectedFn>(
  queryFn: Fn,
  opts?: () => PRPCOptions
): (
  mutationOpts?: FCreateMutationOptions<InferReturnType<Fn>>
) => CreateMutationResult<InferReturnType<Fn>, Error, AsParam<Fn, false>>;

export function mutation$(...args: any[]) {
  const { fn, opts } = getPRPCInput(...args);

  return (mutationOpts?: any) =>
    createMutation(() => ({
      mutationKey: genQueryKey(undefined, opts?.()),
      mutationFn: (input) => fn(unwrapValue(input)),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((mutationOpts?.() || {}) as any),
    })) as CreateMutationResult;
}
