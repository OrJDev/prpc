import type { Plugin } from 'vite'

type Preface = 'query$' | 'mutation$'

export function prpc(): Plugin {
  const mutationRgx =
    /mutation\$\(\s*(?:async\s*)?\((\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(\(\)\s*=>*[\s\S]*?\}\))/g
  const queryRgx =
    /query\$\(\s*(?:async\s*)?\((\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(\(\)\s*=>*[\s\S]*?\}\))/g

  const zodRgx =
    /(?:async\s*)?\((\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(z\.object\([\s\S]*?\}\))\s*,\s*(\(\)\s*=>*[\s\S]*\}\))/g

  const parseArgs = (args: string): { args: string; isAsync: boolean } => {
    let isAsync = false

    if (args.includes('async')) {
      args = args.split('async')[1]
      isAsync = true
    }
    if (args.includes(':')) {
      args = args.split(':')[0]
    }
    args = args.trim()

    if (!args.endsWith(')')) args = args + ')'
    if (!args.startsWith('(')) args = '(' + args

    return { args, isAsync }
  }

  const parseFunction = (preface: Preface) => {
    return (match: string, ...groups: string[]) => {
      if (zodRgx.test(match)) {
        return match.replace(zodRgx, (_, ...zodGroups: string[]) => {
          const [func, zodSchema, keyOptions] = zodGroups

          const [args, funcBody] = func.split('=> {\n')

          const { args: parsedArgs, isAsync } = parseArgs(args)

          // Create the schema at the top of the function, parse it, then return the rest.
          const updatedCode = `${isAsync ? '(' : ''}server$(${
            isAsync ? 'async ' : ''
          }${parsedArgs} => {\nconst schema = ${zodSchema};\nschema.parse${parsedArgs};\n${funcBody}),\n${keyOptions}`
          return updatedCode
        })
      } else {
        const [func, keyOptions] = groups
        const [args, funcBody] = func.split(`=> {\n`)

        const { args: parsedArgs, isAsync } = parseArgs(args)

        // Parse it to add server$, then return the rest.
        const updatedCode = `${preface}(server$(${
          isAsync ? 'async ' : ''
        }${parsedArgs} => {\n${funcBody}),\n${keyOptions}`
        return updatedCode
      }
    }
  }

  return {
    enforce: 'pre',
    name: 'prpc',
    transform(code: string, id: string) {
      if (
        id.endsWith('.ts') &&
        (queryRgx.test(code) || mutationRgx.test(code))
      ) {
        if (!code.trim().includes(`import server$`)) {
          code = `import server$ from "solid-start/server";\n${code}`
        }
        const newCode = `${code
          .replace(queryRgx, parseFunction('query$'))
          .replace(mutationRgx, parseFunction('mutation$'))}`

        console.log('newCoden', newCode)
        return newCode
      }
      return null
    },
  }
}
