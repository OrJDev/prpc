import type { Plugin } from "vite";

export default function prpc(): Plugin {
  return {
    enforce: "pre",
    // @ts-expect-error - name is not in the type
    name: "prpc",
    transform(code: string, id: string) {
      const mRgx =
        /query\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
      if (id.endsWith(".ts") && mRgx.test(code)) {
        return `import server$ from "solid-start/server";\n${code.replace(
          mRgx,
          "query$(server$($1 => {$2}))"
        )}`;
      }
      return null;
    },
  };
}
