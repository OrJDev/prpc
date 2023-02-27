import type { Plugin } from 'vite'

type Preface = 'query$' | 'mutation$' | 'queryV2$'

const mutationRgx =
  /mutation\$\(\s*((?:async\s*)?\(\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(\(\)\s*=>*[\s\S]*?\}\))/g
const queryRgx =
  /query\$\(\s*((?:async\s*)?\(\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(\(\)\s*=>*[\s\S]*?\}\))/g

const zodCheckRgx = /z.object/g

const v2ZodRgx =
  /(queryV2\$|mutationV2\$)\(\s*(?:async\s*)?(\(\{\s*\w+\s*(?:.*?)\}\)\s*=>[\s\S]*?\s*\}),\s*([^,]+\(.+?\)*\}\)),\s*(?:'|"|`)([a-z0-9]*)/g
const v2Rgx =
  /(queryV2\$|mutationV2\$)\(\s*(?:async\s*)?(\(\{\s*\w+\s*(?:.*?)\}\)\s*=>(?:[\s\S](?!z.object))*?\s*\}),\s*(?:'|"|`)([a-zA-Z0-9]*)/g

const zodRgx =
  /((?:async\s*)?\(\s*\w+\s*(?:.*?)\)\s*=>[\s\S]*?)\s*,\s*(z\.object\([\s\S]*?\}\))\s*,\s*(\(\)\s*=>*[\s\S]*\}\))/g

const requestRgx = /request/g

const parseV2Func = (funcBody: string): string => {
  if (requestRgx.test(funcBody)) {
    return funcBody.replace(requestRgx, 'server$.request')
  } else {
    return funcBody
  }
}

const parseArgs = (args: string): { args: string; isAsync: boolean } => {
  let isAsync = false

  if (args.includes('async')) {
    args = args.split('async')[1]
    isAsync = true
  }
  if (args.includes(':')) {
    args = args.split(':')[0] + ')'
  }
  args = args.trim()

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

const parseV2Function = (match: string, ...groups: string[]) => {
  if (zodCheckRgx.test(match)) {
    return match.replace(v2ZodRgx, (_, ...zodGroups: string[]) => {
      const [preface, func, zodSchema, key] = zodGroups

      const [args, funcBody] = func.split('=> {\n')
      const functionParsed = parseV2Func(funcBody)

      const { args: parsedArgs, isAsync } = parseArgs(args)

      // Create the schema at the top of the function, parse it, then return the rest.
      const updatedCode = `${preface}(${isAsync ? '(' : ''}server$(${
        isAsync ? 'async ' : ''
      }${parsedArgs} => {\nconst schema = ${zodSchema};\nschema.parse(payload);\n${functionParsed}),\n'${key}`
      return updatedCode
    })
  } else {
    const [preface, func, key] = groups
    const [args, funcBody] = func.split(`=> {\n`)
    const functionParsed = parseV2Func(funcBody)

    const { args: parsedArgs, isAsync } = parseArgs(args)

    // Parse it to add server$, then return the rest.
    const updatedCode = `${preface}(server$(${
      isAsync ? 'async ' : ''
    }${parsedArgs} => {\n${functionParsed}),\n'${key}`

    return updatedCode
  }
}

export function prpc(): Plugin {
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
          .replace(mutationRgx, parseFunction('mutation$'))
          .replace(v2Rgx, parseV2Function)
          .replace(v2ZodRgx, parseV2Function)}`

        return newCode
      }
      return null
    },
  }
}
