import type { Plugin } from "vite";

export default function prpc(): Plugin {
  const queryRgx =
    /query\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
  const mutationRgx =
    /mutation\$\((\s*\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
  const zodCheckRgx =
    /\((\s*\w+\s*\)\s*=>[\s\S]*?)\s*,\s*(z\.object\([\s\S]*?\}\))\s*/g;
  return {
    enforce: "pre",
    name: "prpc",
    transform(code: string, id: string) {
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
          .replace(queryRgx, (match, ...group: string[]) => {
            if (zodCheckRgx.test(match)) {
              return match.replace(zodCheckRgx, (_, ...zodGroup: string[]) => {
                // This regex splits the arguments into their own groups.
                const [func, zodSchema] = zodGroup;
                // Need to split the args from the func body so we can insert the zod validations
                const [args, funcBody] = func.split(`=> {\n`);

                // Create the schema at the top of the function. Logging is for initial testing, we will want to remove it before it is prod ready. Them parse the args, but my regex sucks and I couldn't get the left ( around it so add it back in haha. Then execute the rest of the function body!
                return `query$(server$((${args} => {\nconst schema = ${zodSchema};\nconsole.log(${args};\nschema.parse((${args});\n${funcBody}))\n`;
              });
            }
            // If there isn't a zod object in the 2nd argument, do the normal parsing where we wrap server$ around the function and args.
            const [args, functionBody] = group;
            return `query$(server$(${args} => {${functionBody}}))`;
          })
          // I think we should make the query function parser reusable to avoid duplications if the argument structures are the same! Leaving this for now because there is an example of it above.
          .replace(mutationRgx, "mutation$(server$($1 => {$2}))")}`;
      }
      return null;
    },
  };
}
