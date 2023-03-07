/* eslint-disable @typescript-eslint/no-explicit-any */
import type babel from '@babel/core'

export function createTransformpRPC$(isAstro: boolean) {
  const serverFnName = isAstro ? 'fetch$' : 'server$'
  return function transformpRPC$({
    types: t,
    template: temp,
  }: {
    types: typeof babel.types
    template: typeof babel.template
  }) {
    return {
      visitor: {
        Program(path: any) {
          if (!isAstro) {
            const serverImport = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' &&
                node.source.value === 'solid-start/server'
            )
            if (!serverImport) {
              path.node.body.unshift(
                t.importDeclaration(
                  [t.importDefaultSpecifier(t.identifier(serverFnName))],
                  t.stringLiteral('solid-start/server')
                )
              )
            }
          } else {
            const serverImport = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' &&
                node.source.value === '@tanstack/bling'
            )
            if (!serverImport) {
              path.node.body.unshift(
                t.importDeclaration(
                  [
                    t.importSpecifier(
                      t.identifier(serverFnName),
                      t.identifier(serverFnName)
                    ),
                  ],
                  t.stringLiteral('@tanstack/bling')
                )
              )
            }
          }
          const callMiddlewareImport = path.node.body.find(
            (node: any) =>
              node.type === 'ImportDeclaration' &&
              node.source.name === 'callMiddleware$'
          )
          if (!callMiddlewareImport) {
            const loc = isAstro ? '../prpc' : '@prpc/solid'
            path.node.body.unshift(
              t.importDeclaration(
                [
                  t.importSpecifier(
                    t.identifier('callMiddleware$'),
                    t.identifier('callMiddleware$')
                  ),
                ],
                t.stringLiteral(loc)
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
            const [serverFunction, key, zodSchema, ..._middlewares] =
              path.node.arguments
            const middlewares = _middlewares?.map((m: any) => m.name)

            if (isAstro) {
              const blingCtx$ = t.identifier('blingCtx$')
              serverFunction.params.push(blingCtx$)

              const payload = t.identifier('payload')
              serverFunction.params[0] = payload
            }
            path.traverse({
              Identifier(innerPath: any) {
                if (
                  innerPath.node.name === 'request$' &&
                  innerPath.scope?.path?.listKey !== 'params'
                ) {
                  innerPath.node.name = isAstro
                    ? 'blingCtx$.request'
                    : 'server$.request'
                }
              },
            })

            if (zodSchema && !isAstro) {
              const schema = temp(`const schema = %%zod%%`)({
                zod: zodSchema,
              })
              const asyncParse = temp(`await schema.parseAsync(payload)`)()
              serverFunction.body.body.unshift(asyncParse)
              serverFunction.body.body.unshift(schema)
              path.node.arguments[2] = t.identifier('undefined')
            }

            if (middlewares.length) {
              const callMiddleware = temp(
                `const ctx$ = await callMiddleware$(server$.request, %%middlewares%%)`
              )({
                middlewares: middlewares.map((m: any) => t.identifier(m)),
              })

              serverFunction.body.body.unshift(callMiddleware)
            }

            const destructuring = serverFunction.params[0]
            if (t.isObjectPattern(destructuring)) {
              destructuring.properties = destructuring.properties.filter(
                (p: any) => p.key.name !== 'request$' && p.key.name !== 'ctx$'
              )
            }

            const originFn = t.arrowFunctionExpression(
              serverFunction.params,
              serverFunction.body,
              true
            )
            const wrappedArg = t.callExpression(t.identifier(serverFnName), [
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
}
