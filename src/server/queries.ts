import { query$ } from "./query";

export const myQueryFn = query$((a: number, b: number) => {
  const result = a + b;
  console.log("myQueryFn", result);
  return result;
});
