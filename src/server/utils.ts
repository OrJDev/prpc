import type { ValueOrAccessor } from "./types";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const unwrapValue = <V extends ValueOrAccessor<any>>(
  value: V
): V extends ValueOrAccessor<infer R> ? R : never => {
  if (typeof value === "function") {
    return value();
  }
  return value as V extends ValueOrAccessor<infer R> ? R : never;
};
