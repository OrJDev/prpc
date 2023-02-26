import { defineConfig } from 'tsup-preset-solid'

export default defineConfig(
  [
    {
      entry: 'src/index.tsx',
      devEntry: true,
      serverEntry: true,
    },
  ],
  {
    printInstructions: false,
    writePackageJson: true,
    dropConsole: false,
    cjs: true,
  }
)
