/* eslint-disable @typescript-eslint/no-explicit-any */
import * as babel from '@babel/core'
import type { Plugin } from 'vite'

export interface PRPCPluginOptions {
  babel?: babel.TransformOptions
}

export function prpc(opts?: PRPCPluginOptions): Plugin {
  return {
    enforce: 'pre',
    name: 'prpc',
    async transform(code: string, id: string) {
      if (
        (code.includes('query$(') || code.includes('mutation$(')) &&
        id.endsWith('.ts')
      ) {
        const transformed = await babel.transformAsync(code, {
          presets: [
            ['@babel/preset-typescript'],
            ...(opts?.babel?.presets ?? []),
          ],
          plugins: [[transformpRPC$], ...(opts?.babel?.plugins ?? [])],
          filename: id,
        })
        if (transformed) {
          return {
            code: transformed.code ?? '',
            map: transformed.map,
          }
        }
      }
      return undefined
    },
  }
}

export function transformpRPC$({
  types: t,
  template: temp,
}: {
  types: typeof babel.types
  template: typeof babel.template
}) {
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

          path.traverse({
            Identifier(innerPath: any) {
              if (
                innerPath.node.name === 'request$' &&
                innerPath.scope?.path?.listKey !== 'params'
              ) {
                innerPath.node.name = 'server$.request'
              }
            },
          })

          if (zodSchema) {
            const schema = temp(`const schema = %%zod%%`)({
              zod: zodSchema,
            })
            const asyncParse = temp(`await schema.parseAsync(payload)`)()
            serverFunction.body.body.unshift(asyncParse)
            serverFunction.body.body.unshift(schema)
            path.node.arguments.pop()
          }

          const originFn = t.arrowFunctionExpression(
            serverFunction.params,
            serverFunction.body,
            true
          )
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
