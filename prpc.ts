import type { Plugin } from "vite";

export default function prpc(): Plugin {
  return {
    enforce: "pre",
    name: "prpc",
    transform(code: string, id: string) {
      const queryRgx =
        /query\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
      const mutationRgx =
        /mutation\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
      if (
        id.endsWith(".ts") &&
        (queryRgx.test(code) || mutationRgx.test(code))
      ) {
        return `import server$ from "solid-start/server";\n${code
          .replace(queryRgx, "query$(server$($1 => {$2}))")
          .replace(mutationRgx, "mutation$(server$($1 => {$2}))")}`;
      }
      return null;
    },
  };
}
