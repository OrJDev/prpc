/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PRPCOptions, ValueOrAccessor } from "./types";

export const unwrapValue = <V extends ValueOrAccessor<any>>(
  value: V
): V extends ValueOrAccessor<infer R> ? R : never => {
  if (typeof value === "function") {
    return value();
  }
  return value as V extends ValueOrAccessor<infer R> ? R : never;
};

export const genQueryKey = (
  input?: any,
  opts?: PRPCOptions,
  isMutation = false
) => {
  if (opts?.key) {
    return [opts.key, input].filter(Boolean);
  }
  if (isMutation) {
    return undefined;
  }
  return ["prpc.query", input].filter(Boolean);
};

export const getPRPCInput = (...args: any[]) => {
  if (args.length === 3) {
    return {
      fn: args[0],
      schema: args[1],
      opts: args[2],
    };
  }
  return {
    fn: args[0],
    opts: args[1],
  };
};
