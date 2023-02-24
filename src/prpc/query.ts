/* eslint-disable @typescript-eslint/no-explicit-any */
import { createQuery, type CreateQueryResult } from "@adeora/solid-query";
import type { z, ZodObject } from "zod";
import type {
  FCreateQueryOptions,
  ExpectedFn,
  InferReturnType,
  PRPCOptions,
  ValueOrAccessor,
} from "./types";
import { genQueryKey, getPRPCInput, unwrapValue } from "./utils";

export function query$<
  ZObj extends ZodObject<any>,
  Fn extends ExpectedFn<z.infer<ZObj>>
>(
  queryFn: Fn,
  schema: ZObj,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>;

export function query$<Fn extends ExpectedFn>(
  queryFn: Fn,
  opts?: () => PRPCOptions
): (
  input: ValueOrAccessor<Parameters<Fn>[0]>,
  queryOpts?: FCreateQueryOptions<InferReturnType<Fn>>
) => CreateQueryResult<InferReturnType<Fn>>;

export function query$(...args: any[]) {
  const { fn, opts } = getPRPCInput(...args);
  // @todo: add schema validation ^
  return (input: any, queryOpts: any) => {
    const innerArgs = () => unwrapValue(input);
    return createQuery(() => ({
      queryKey: genQueryKey(innerArgs(), opts?.()),
      queryFn: () => fn(innerArgs()),
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      ...((queryOpts?.() || {}) as any),
    }));
  };
}
