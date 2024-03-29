/* eslint-disable @typescript-eslint/no-explicit-any */
import type { PRPCPluginOptions } from '.'
import * as babel from '@babel/core'

export type PRPCAdapter =
  | 'solid'
  | 'react-bling'
  | 'solid-bling'
  | 'react-thaler'

const figureOutAdapter = (adapter?: PRPCAdapter) => {
  if (!adapter) {
    return 'solid'
  }
  if (adapter.includes('react')) return 'react'
  if (adapter.includes('solid')) return 'solid'
  return adapter
}

export function createTransformpRPC$(adapter: PRPCAdapter) {
  return function transformpRPC$({
    types: t,
    template: temp,
  }: {
    types: typeof babel.types
    template: typeof babel.template
  }) {
    const isAstro = adapter.includes('bling')
    const isThaler = adapter.includes('thaler')
    return {
      visitor: {
        Program(path: any) {
          if (!isAstro && !isThaler) {
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
            const from = isThaler ? 'thaler' : '@tanstack/bling'
            const shouldImport = isThaler ? 'post$' : 'server$'
            const serverImport = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' &&
                node.source.value === from &&
                node.specifiers.find(
                  (specifier: any) =>
                    specifier.type === 'ImportSpecifier' &&
                    specifier.imported.name === shouldImport
                )
            )
            if (!serverImport) {
              path.node.body.unshift(
                t.importDeclaration(
                  [
                    t.importSpecifier(
                      t.identifier(shouldImport),
                      t.identifier(shouldImport)
                    ),
                  ],
                  t.stringLiteral(from)
                )
              )
            }
          }

          const loc = `@prpc/${figureOutAdapter(adapter)}`
          const importIfNotThere = (name: string) => {
            const imported = path.node.body.find(
              (node: any) =>
                node.type === 'ImportDeclaration' && node.source.name === loc
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
        CallExpression(path: babel.NodePath<babel.types.CallExpression>) {
          const { callee } = path.node
          const isReuseableQuery =
            t.isMemberExpression(callee) &&
            t.isIdentifier(callee.property, { name: 'query$' })
          const isReuseableMutation =
            t.isMemberExpression(callee) &&
            t.isIdentifier(callee.property, { name: 'mutation$' })

          const isMutation =
            t.isIdentifier(callee, { name: 'mutation$' }) || isReuseableMutation
          const isQuery =
            t.isIdentifier(callee, { name: 'query$' }) || isReuseableQuery

          if (isMutation || isQuery) {
            let serverFunction, key, zodSchema, middlewares
            if (path.node.arguments.length === 1) {
              const arg = path.node.arguments[0]
              if (t.isObjectExpression(arg)) {
                serverFunction = (
                  arg.properties.find(
                    (prop: any) =>
                      prop.key.name === (isQuery ? 'queryFn' : 'mutationFn')
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
                if (!isReuseableQuery && !isReuseableMutation) {
                  middlewares =
                    (
                      arg.properties.find(
                        (prop: any) => prop.key.name === 'middlewares'
                      ) as any
                    )?.value?.elements.map((e: any) => e.name) ?? []
                }
              }
            } else {
              const [_serverFunction, _key, ...rest] = path.node.arguments
              serverFunction = _serverFunction
              key = _key
              zodSchema = rest.find((e: any) => {
                const isZodSchema = e?.properties?.find(
                  (prop: any) => prop.key.name === '_def'
                )
                return isZodSchema
              })
              middlewares = rest
                .slice(zodSchema ? 1 : 0)
                .map((e: any) => e.name)
                .filter(Boolean)
            }

            const cleanOutParams = (
              name: string,
              id: string | ReturnType<typeof t.identifier>
            ) => {
              path.traverse({
                Identifier(innerPath: any) {
                  if (
                    innerPath.node.name === name &&
                    innerPath.scope?.path?.listKey !== 'params'
                  ) {
                    if (innerPath.parentPath.isObjectProperty()) {
                      innerPath.parentPath.remove()
                      if (
                        innerPath.parentPath.parentPath.isVariableDeclarator() &&
                        innerPath.parentPath.parentPath.node.id.properties
                          .length === 0
                      ) {
                        innerPath.parentPath.parentPath.remove()
                      }
                    } else {
                      innerPath.node.name =
                        typeof id === 'string' ? id : id.name
                    }
                  }
                },
              })
            }

            if (isAstro || isThaler) {
              const req = t.objectProperty(
                t.identifier('request'),
                t.identifier('_$$request')
              )
              cleanOutParams('request$', '_$$request')
              serverFunction.params[1] = t.objectPattern([req])
            }

            const payload = t.objectProperty(
              t.identifier('payload'),
              t.identifier('_$$payload')
            )
            cleanOutParams('payload', '_$$payload')
            serverFunction.params[0] = t.objectPattern([payload])

            if (!isThaler && !isAstro) {
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
            }

            if (
              middlewares?.length ||
              isReuseableQuery ||
              isReuseableMutation
            ) {
              if (isThaler) {
                cleanOutParams('ctx$', 'ctx$')
              }
              const req = isThaler || isAstro ? '_$$request' : 'server$.request'
              let callMiddleware
              if (isReuseableQuery || isReuseableMutation) {
                const name = (callee.object as any).name
                callMiddleware = temp(
                  `const ctx$ = await ${name}.callMw(${req})`
                )()
              } else {
                callMiddleware = temp(
                  `const ctx$ = await callMiddleware$(${req}, %%middlewares%%)`
                )({
                  middlewares: middlewares.map((m: any) => t.identifier(m)),
                })
              }
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
                `const _$$validatedZod = await validateZod(_$$payload, %%zodSchema%%);`
              )({ zodSchema: zodSchema })
              const ifStatement = t.ifStatement(
                t.binaryExpression(
                  'instanceof',
                  t.identifier('_$$validatedZod'),
                  t.identifier('Response')
                ),
                t.returnStatement(t.identifier('_$$validatedZod'))
              )
              const setPayload = temp(`_$$payload = _$$validatedZod`)()
              serverFunction.body.body.unshift(
                asyncParse,
                ifStatement,
                setPayload
              )
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
            const wrappedArg = t.callExpression(
              t.identifier(isThaler ? 'post$' : 'server$'),
              [originFn]
            )
            const newCallExpr = t.callExpression(callee, [wrappedArg, key])
            path.replaceWith(newCallExpr)
            path.skip()
          }
        },
      },
    }
  }
}

export async function compilepRRPC(
  code: string,
  id: string,
  opts?: PRPCPluginOptions
) {
  const plugins: babel.ParserOptions['plugins'] = ['typescript', 'jsx']
  const transformpRPC$ = createTransformpRPC$(opts?.adapter ?? 'solid')
  const transformed = await babel.transformAsync(code, {
    presets: [['@babel/preset-typescript'], ...(opts?.babel?.presets ?? [])],
    parserOpts: {
      plugins,
    },
    plugins: [[transformpRPC$], ...(opts?.babel?.plugins ?? [])],
    filename: id,
  })
  if (transformed) {
    if (opts?.log) {
      console.log(transformed.code)
    }
    return {
      code: transformed.code ?? '',
      map: transformed.map,
    }
  }
  return null
}
