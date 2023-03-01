/* eslint-disable @typescript-eslint/no-explicit-any */
import type { Plugin } from 'vite'
import { transform } from '@babel/core'

export function prpc(): Plugin {
  return {
    enforce: 'pre',
    name: 'prpc',
    transform(code: string, id: string) {
      if (
        (code.includes('query$(') || code.includes('mutation$(')) &&
        id.endsWith('.ts')
      ) {
        const transformed = transform(code, {
          presets: ['@babel/preset-typescript'],
          plugins: [transformpRPC$],
          filename: id,
        })
        if (transformed) {
          return transformed.code
        }
      }
      return null
    },
  }
}

function transformpRPC$({ types: t }: { types: any }) {
  return {
    visitor: {
      Program(path: any) {
        const serverImport = path.node.body.find(
          (node: any) =>
            node.type === 'ImportDeclaration' &&
            node.source.value === 'solid-start/server'
        )
        if (!serverImport) {
          path.node.body.unshift(
            t.importDeclaration(
              [t.importDefaultSpecifier(t.identifier('server$'))],
              t.stringLiteral('solid-start/server')
            )
          )
        }
      },
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

          const originFn = t.arrowFunctionExpression(
            serverFunction.params,
            serverFunction.body
          )
          if (serverFunction.async) {
            console.log('async')
          }
          const wrappedArg = t.callExpression(t.identifier('server$'), [
            originFn,
          ])

          const newCallExpr = t.callExpression(callee, [wrappedArg, key])
          path.replaceWith(newCallExpr)
          path.skip()
        }
      },
    },
  }
}
