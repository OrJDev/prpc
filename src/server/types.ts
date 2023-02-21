import type { Accessor } from "solid-js";

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type InferReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer R2>
    ? R2
    : R
  : never;

export type ValueOrAccessor<T = unknown> = T | Accessor<T>;
