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
        if (
          !/import\s+server\$\s+from\s+["']solid-start\/server["']/g.test(code)
        ) {
          code = `import server$ from "solid-start/server";\n${code}`;
        }
        return `${code
          .replace(queryRgx, "query$(server$($1 => {$2}))")
          .replace(mutationRgx, "mutation$(server$($1 => {$2}))")}`;
      }
      return null;
    },
  };
}
