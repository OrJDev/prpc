import { isServer } from "solid-js/web";
import { z } from "zod";
import { mutation$ } from "../prpc/mutation";

export const add = mutation$(
  (input: { a: number; b: number }) => {
    const result = input.a + input.b;
    console.log(isServer);
    console.log("add", result);
    return result;
  },
  () => ({
    key: "add",
  })
);

export const decrease = mutation$(
  (input) => {
    const result = input.a + input.b;
    console.log(isServer);
    console.log("add", result);
    return result;
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: "decrease",
  })
);
