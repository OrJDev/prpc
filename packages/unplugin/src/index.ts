import { createUnplugin } from 'unplugin'
import { createFilter } from '@rollup/pluginutils'
import { compilepRRPC, type PRPCPluginOptions } from '@prpc/compiler'

const DEFAULT_INCLUDE = 'src/**/*.{jsx,tsx,ts,js,mjs,cjs}'
const DEFAULT_EXCLUDE = 'node_modules/**/*.{jsx,tsx,ts,js,mjs,cjs}'

const prpcPlugin = createUnplugin((options: PRPCPluginOptions) => {
  const filter = createFilter(
    options.filter?.include || DEFAULT_INCLUDE,
    options.filter?.exclude || DEFAULT_EXCLUDE
  )

  options.adapter ??= 'solid'

  return {
    name: 'prpc',
    vite: {
      enforce: 'pre',
      async transform(code, id) {
        return await compilepRRPC(code, id, options)
      },
    },
    transformInclude(id) {
      return filter(id)
    },
    async transform(code, id) {
      return await compilepRRPC(code, id, options)
    },
  }
})

export default prpcPlugin
