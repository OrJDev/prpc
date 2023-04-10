import { defineConfig } from 'tsup'

export default defineConfig({
  entry: ['src/index.tsx'],
  format: ['esm', 'cjs'],
  dts: true,
  sourcemap: true,
  clean: true,
  minify: true,
  target: 'es2019',
  external: ['react', 'react-dom'],
  write: true,
  splitting: true,
  bundle: true,
  watch: false,
})
