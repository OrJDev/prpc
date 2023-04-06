/* eslint-disable @typescript-eslint/no-explicit-any */
import type babel from '@babel/core'

export type PRPCAdapter = 'solid' | 'react-bling' | 'solid-bling'

export function createTransformpRPC$(adapter: PRPCAdapter) {
  return function transformpRPC$({
    types: t,
    template: temp,
  }: {
    types: typeof babel.types
    template: typeof babel.template
  }) {
    const isAstro = adapter.includes('bling')
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
                  [t.importDefaultSpecifier(t.identifier('server$'))],
                  t.stringLiteral('solid-start/server')
                )
              )
            }
          } else {
            const serverImport = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' &&
                node.source.value === '@tanstack/bling' &&
                node.specifiers.find(
                  (specifier: any) =>
                    specifier.type === 'ImportSpecifier' &&
                    specifier.imported.name === 'server$'
                )
            )
            if (!serverImport) {
              path.node.body.unshift(
                t.importDeclaration(
                  [
                    t.importSpecifier(
                      t.identifier('server$'),
                      t.identifier('server$')
                    ),
                  ],
                  t.stringLiteral('@tanstack/bling')
                )
              )
            }
          }

          const loc =
            adapter === 'solid-bling' ? '@prpc/solid' : `@prpc/${adapter}`
          const importIfNotThere = (name: string) => {
            const imported = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' && node.source.name === name
            )
            if (!imported) {
              path.node.body.unshift(
                t.importDeclaration(
                  [t.importSpecifier(t.identifier(name), t.identifier(name))],
                  t.stringLiteral(loc)
                )
              )
            }
          }
          importIfNotThere('callMiddleware$')
          importIfNotThere('validateZod')
        },
        CallExpression(path: any) {
          const { callee } = path.node
          const isMutation = t.isIdentifier(callee, { name: 'mutation$' })
          const isQuery = t.isIdentifier(callee, { name: 'query$' })
          if (isMutation || isQuery) {
            let serverFunction: any
            let key: any
            let zodSchema: any
            let middlewares: any
            const arg = path.node.arguments[0]
            if (t.isObjectExpression(arg)) {
              if (t.isObjectExpression(arg)) {
                serverFunction = (
                  arg.properties.find((prop: any) =>
                    prop.key.name === isQuery ? 'queryFn' : 'mutationFn'
                  ) as any
                ).value
                key = (
                  arg.properties.find(
                    (prop: any) => prop.key.name === 'key'
                  ) as any
                ).value
                zodSchema = (
                  arg.properties.find(
                    (prop: any) => prop.key.name === 'schema'
                  ) as any
                )?.value
                middlewares = path.node.arguments
                  .slice(1)
                  .map((e: any) => e.name)
              }
            } else {
              const [_serverFunction, _key, ...rest] = path.node.arguments
              serverFunction = _serverFunction
              key = _key
              zodSchema = rest.find((e: any) => {
                return !t.isFunctionExpression(e)
              })
              middlewares = rest
                .slice(zodSchema ? 1 : 0)
                .map((e: any) => e.name)
                .filter(Boolean)
            }
            if (isAstro) {
              const blingCtx$ = t.identifier('blingCtx$')
              serverFunction.params.push(blingCtx$)
            }
            const payload = t.identifier('payload')
            serverFunction.params[0] = payload
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

            if (middlewares?.length) {
              const callMiddleware = temp(
                `const ctx$ = await callMiddleware$(server$.request, %%middlewares%%)`
              )({
                middlewares: middlewares.map((m: any) => t.identifier(m)),
              })
              const ifStatement = t.ifStatement(
                t.binaryExpression(
                  'instanceof',
                  t.identifier('ctx$'),
                  t.identifier('Response')
                ),
                t.returnStatement(t.identifier('ctx$'))
              )
              serverFunction.body.body.unshift(callMiddleware, ifStatement)
            }

            if (
              zodSchema &&
              t.isIdentifier(zodSchema, { name: 'undefined' }) === false
            ) {
              const asyncParse = temp(
                `const _$$validatedZod = await validateZod(payload, %%zodSchema%%);`
              )({ zodSchema: zodSchema })
              const ifStatement = t.ifStatement(
                t.binaryExpression(
                  'instanceof',
                  t.identifier('_$$validatedZod'),
                  t.identifier('Response')
                ),
                t.returnStatement(t.identifier('_$$validatedZod'))
              )
              serverFunction.body.body.unshift(asyncParse, ifStatement)
              // path.node.arguments[2] = t.identifier('undefined')
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
}
