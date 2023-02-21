import { isServer } from "solid-js/web";
import { mutation$ } from "../prpc/mutation";

export const add = mutation$((input: { a: number; b: number }) => {
  const result = input.a + input.b;
  console.log(isServer);
  console.log("add", result);
  return result;
});
