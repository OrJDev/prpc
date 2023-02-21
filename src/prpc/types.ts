/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Accessor } from "solid-js";

export type InferReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer R2>
    ? R2
    : R
  : never;

export type ValueOrAccessor<T = unknown> = T | Accessor<T>;

export type AsParam<
  Fn extends (input: any) => any,
  CAccessor extends boolean = true
> = CAccessor extends true
  ? ValueOrAccessor<Parameters<Fn>[0]>
  : Parameters<Fn>[0];
