import { isServer } from "solid-js/web";
import { query$ } from "./query";

export const add = query$((input: { a: number; b: number }) => {
  const result = input.a + input.b;
  console.log(isServer);
  console.log("add", result);
  return result;
});

export const divide = query$((input: { a: number; b: number }) => {
  const result = input.a / input.b;
  console.log("divide", result);
  return result;
});
