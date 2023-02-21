import { isServer } from "solid-js/web";
import { query$ } from "./query";

export const add = query$((a: number, b: number) => {
  const result = a + b;
  console.log(isServer);
  console.log("add", result);
  return result;
});

export const divide = query$((a: number, b: number) => {
  const result = a / b;
  console.log("divide", result);
  return result;
});
