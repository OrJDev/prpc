import type { Plugin } from "vite";

const convert$ToServer$: Plugin = {
  enforce: "pre",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(code: any, id: any) {
    if (id.endsWith(".ts") && code.includes("query$")) {
      const newCode = code.replace(
        /query\$(\s*)\((\s*)([^\s].*?)\)/g,
        "query$(server$($3)"
      );
      const withServer = `import server$ from "solid-start/server";
  ${newCode}
  `;
      console.log("newCode", withServer);
    }
    return null;
  },
};

export default () => convert$ToServer$;
