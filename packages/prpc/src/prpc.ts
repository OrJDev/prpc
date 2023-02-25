import type { Plugin } from "vite";

export function prpc(): Plugin {
  const queryRgx =
    /query\$\((\s*(?:async\s*)?\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
  const mutationRgx =
    /mutation\$\((\s*(?:async\s*)?\((?:[^)(]*|\((?:[^)(]*|\([^)(]*\))*\))*\))\s*=>\s*{([\s\S]*?)}\)/g;
  const zodCheckRgx =
    /\(\s(?:async\s*)?\((\s*\w+\s*\)\s*=>[\s\S]*?)\s*,\s*(z\.object\([\s\S]*?\}\))\s*/g;
  const serverCheckRgx =
    /import\s+server\$\s+from\s+["']solid-start\/server["']/g;

  const parseFunction = (preface: "query$" | "mutation$") => {
    return (match: string, ...groups: string[]) => {
      if (zodCheckRgx.test(match)) {
        return match.replace(zodCheckRgx, (_, ...zodGroup: string[]) => {
          // This regex splits the arguments into their own groups.
          const [func, zodSchema] = zodGroup;
          // Need to split the args from the func body so we can insert the zod validations
          const [args, funcBody] = func.split(`=> {\n`);

          console.log({ func, zodSchema, args, funcBody });

          // console.log(
          //   `${preface}(server$((${args} => {\nconst schema = ${zodSchema};\nconsole.log(${args};\nschema.parse((${args});\n${funcBody}))\n`
          // );
          // Create the schema at the top of the function. Logging is for initial testing, we will want to remove it before it is prod ready. Them parse the args, but my regex sucks and I couldn't get the left ( around it so add it back in haha. Then execute the rest of the function body!
          return `${preface}(server$((${args} => {\nconst schema = ${zodSchema};\nconsole.log(${args};\nschema.parse(${args};\n${funcBody}))\n`;
        });
      }
      // If there isn't a zod object in the 2nd argument, do the normal parsing where we wrap server$ around the function and args.
      const [args, functionBody] = groups;
      return `${preface}(server$(${args} => {${functionBody}}))`;
    };
  };

  return {
    enforce: "pre",
    name: "prpc",
    transform(code: string, id: string) {
      if (
        id.endsWith(".ts") &&
        (queryRgx.test(code) || mutationRgx.test(code))
      ) {
        if (!serverCheckRgx.test(code)) {
          code = `import server$ from "solid-start/server";\n${code}`;
        }
        return `${code
          .replace(queryRgx, parseFunction("query$"))
          .replace(mutationRgx, parseFunction("mutation$"))}`;
      }
      return null;
    },
  };
}
