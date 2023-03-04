import * as babel from '@babel/core';
import type { Plugin } from 'vite';
export interface PRPCPluginOptions {
    babel?: babel.TransformOptions;
}
export default function prpc(opts?: PRPCPluginOptions): Plugin;
export declare function transformpRPC$({ types: t, template: temp, }: {
    types: typeof babel.types;
    template: typeof babel.template;
}): {
    visitor: {
        Program(path: any): void;
        CallExpression(path: any): void;
    };
};
