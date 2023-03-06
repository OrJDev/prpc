/* eslint-disable @typescript-eslint/no-explicit-any */
import * as babel from '@babel/core';
export default function prpc(opts) {
    return {
        enforce: 'pre',
        name: 'prpc',
        async transform(code, id) {
            var _a, _b, _c, _d, _e;
            if ((code.includes('query$(') || code.includes('mutation$(')) &&
                id.endsWith('.ts')) {
                const transformed = await babel.transformAsync(code, {
                    presets: [
                        ['@babel/preset-typescript'],
                        ...((_b = (_a = opts === null || opts === void 0 ? void 0 : opts.babel) === null || _a === void 0 ? void 0 : _a.presets) !== null && _b !== void 0 ? _b : []),
                    ],
                    plugins: [[transformpRPC$], ...((_d = (_c = opts === null || opts === void 0 ? void 0 : opts.babel) === null || _c === void 0 ? void 0 : _c.plugins) !== null && _d !== void 0 ? _d : [])],
                    filename: id,
                });
                if (transformed) {
                    return {
                        code: (_e = transformed.code) !== null && _e !== void 0 ? _e : '',
                        map: transformed.map,
                    };
                }
            }
            return undefined;
        },
    };
}
export function transformpRPC$({ types: t, template: temp, }) {
    return {
        visitor: {
            Program(path) {
                const serverImport = path.node.body.find((node) => node.type === 'ImportDeclaration' &&
                    node.source.value === 'solid-start/server');
                if (!serverImport) {
                    path.node.body.unshift(t.importDeclaration([t.importDefaultSpecifier(t.identifier('server$'))], t.stringLiteral('solid-start/server')));
                }
                const callMiddlewareImport = path.node.body.find((node) => node.type === 'ImportDeclaration' &&
                    node.source.name === 'callMiddleware$');
                if (!callMiddlewareImport) {
                    path.node.body.unshift(t.importDeclaration([
                        t.importSpecifier(t.identifier('callMiddleware$'), t.identifier('callMiddleware$')),
                    ], t.stringLiteral('@prpc/solid')));
                }
            },
            CallExpression(path) {
                const { callee } = path.node;
                // if (t.isIdentifier(callee, { name: 'middleware$' })) {
                //   const [serverFunction] = path.node.arguments
                //   path.traverse({
                //     Identifier(innerPath: any) {
                //       if (
                //         innerPath.node.name === 'request$' &&
                //         innerPath.scope?.path?.listKey !== 'params'
                //       ) {
                //         innerPath.node.name = 'server$.request'
                //       }
                //     },
                //   })
                //   const destructuring = serverFunction.params[0]
                //   if (t.isObjectPattern(destructuring)) {
                //     destructuring.properties = destructuring.properties.filter(
                //       (p: any) => p.key.name !== 'request$' && p.key.name !== 'ctx$'
                //     )
                //   }
                // }
                if (t.isIdentifier(callee, { name: 'query$' }) ||
                    t.isIdentifier(callee, { name: 'mutation$' })) {
                    const [serverFunction, key, zodSchema, ..._middlewares] = path.node.arguments;
                    const middlewares = _middlewares === null || _middlewares === void 0 ? void 0 : _middlewares.map((m) => m.name);
                    path.traverse({
                        Identifier(innerPath) {
                            var _a, _b;
                            if (innerPath.node.name === 'request$' &&
                                ((_b = (_a = innerPath.scope) === null || _a === void 0 ? void 0 : _a.path) === null || _b === void 0 ? void 0 : _b.listKey) !== 'params') {
                                innerPath.node.name = 'server$.request';
                            }
                        },
                    });
                    if (zodSchema) {
                        const schema = temp(`const schema = %%zod%%`)({
                            zod: zodSchema,
                        });
                        const asyncParse = temp(`await schema.parseAsync(payload)`)();
                        serverFunction.body.body.unshift(asyncParse);
                        serverFunction.body.body.unshift(schema);
                        path.node.arguments[2] = t.identifier('undefined');
                    }
                    if (middlewares.length) {
                        const callMiddleware = temp(`const ctx$  = await callMiddleware$(server$.request, %%middlewares%%)`)({
                            middlewares: middlewares.map((m) => t.identifier(m)),
                        });
                        // path.node.arguments.splice(3).forEach(() => {
                        //   path.node.arguments.push(t.identifier('undefined'))
                        // })
                        serverFunction.body.body.unshift(callMiddleware);
                    }
                    const destructuring = serverFunction.params[0];
                    if (t.isObjectPattern(destructuring)) {
                        destructuring.properties = destructuring.properties.filter((p) => p.key.name !== 'request$' && p.key.name !== 'ctx$');
                    }
                    const originFn = t.arrowFunctionExpression(serverFunction.params, serverFunction.body, true);
                    const wrappedArg = t.callExpression(t.identifier('server$'), [
                        originFn,
                    ]);
                    const newCallExpr = t.callExpression(callee, [wrappedArg, key]);
                    path.replaceWith(newCallExpr);
                    path.skip();
                }
            },
        },
    };
}
//# sourceMappingURL=index.js.map