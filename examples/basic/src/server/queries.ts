import { query$ } from "prpc";
import { isServer } from "solid-js/web";
import { z } from "zod";

export const add = query$(
  (input) => {
    const result = input.a + input.b;
    console.log(isServer /* true */);
    console.log("add", result);
    return result;
  },
  z.object({
    a: z.number(),
    b: z.number(),
  }),
  () => ({
    key: "add",
  })
);

export const decrease = query$(
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
