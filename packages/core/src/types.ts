/* eslint-disable @typescript-eslint/no-explicit-any */

export type InferReturnType<T> = T extends (...args: any[]) => infer R
  ? R extends Promise<infer R2>
    ? R2
    : R
  : never

export type ValueOrAccessor<T = unknown> = T extends undefined
  ? void | undefined
  : T | (() => T)

export type ExpectedInput<T> = {
  payload: T
  request$: Request
}

export type ExpectedFn<T = any> = (props: ExpectedInput<T>) => any

export type AsParam<
  Fn extends ExpectedFn,
  CAccessor extends boolean = true
> = CAccessor extends true
  ? ValueOrAccessor<UnwrapFnInput<Parameters<Fn>[0]>>
  : UnwrapFnInput<Parameters<Fn>[0]>

export type UnwrapFnInput<T> = T extends ExpectedInput<infer B> ? B : T

export type OmitQueryData<T> = Omit<T, 'queryKey' | 'queryFn'>

export type MergeRedirect<T> = T & { alwaysCSRRedirect?: boolean }
