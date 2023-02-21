import type { Plugin } from "vite";

const convert$ToServer$: Plugin = {
  enforce: "pre",
  name: "convert$ToServer$",
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  transform(code: any, id: any) {
    const mRgx =
      /query\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
    if (id.endsWith(".ts") && mRgx.test(code)) {
      const newCode = code.replace(mRgx, "query$(server$($1 => {$2}))");
      const withServer = `import server$ from "solid-start/server";\n${newCode}`;
      return withServer;
    }
    return null;
  },
};

export default () => convert$ToServer$;
