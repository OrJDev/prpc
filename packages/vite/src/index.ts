/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Plugin } from 'vite'
import { transform } from '@babel/core'

export function prpc(): Plugin {
  return {
    enforce: 'pre',
    name: 'prpc',
    transform(code: string, id: string) {
      if (
        (id.endsWith('.ts') && code.includes('query$(')) ||
        code.includes('mutation$(')
      ) {
        const transformed = transform(code, {
          plugins: [transformpRPC$],
        })
        if (transformed) {
          console.log('transformed', transformed.code)
        }
      }
      return null
    },
  }
}

function transformpRPC$({ types: t }: { types: any }) {
  return {
    visitor: {
      CallExpression(path: any) {
        const { callee } = path.node
        if (
          t.isIdentifier(callee, { name: 'query$' }) ||
          t.isIdentifier(callee, { name: 'mutation$' })
        ) {
          const [serverFunction, key, zodSchema] = path.node.arguments
          serverFunction.body.body.forEach((body: any) => {
            if (
              body.expression &&
              body.expression.object &&
              body.expression.object.name === 'request$'
            ) {
              body.expression.object.name = 'server$.request'
            }
          })
          if (zodSchema) {
            serverFunction.body.body.unshift(t.identifier('.parse(payload)'))
            serverFunction.body.body.unshift(zodSchema)
            path.node.arguments.pop()
          }

          const wrappedArg = t.callExpression(t.identifier('server$'), [
            t.arrowFunctionExpression(
              serverFunction.params,
              serverFunction.body
            ),
          ])
          const newCallExpr = t.callExpression(callee, [wrappedArg, key])
          path.replaceWith(newCallExpr)
          path.skip()
        }
      },
    },
  }
}
