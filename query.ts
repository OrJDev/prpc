import type { Plugin } from "vite";

const convert$ToServer$: Plugin = {
  enforce: "pre",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(code: any, id: any) {
    const mRgx = /query\$(\s*)\((\s*)([^\s].*?)\)/g;
    if (id.endsWith(".ts") && mRgx.test(code)) {
      const newCode = code.replace(mRgx, "query$(server$($3)");
      const withServer = `import server$ from "solid-start/server";
  ${newCode}
  `;
      console.log("newCode", withServer);
    }
    return null;
  },
};

export default () => convert$ToServer$;
