#!/usr/bin/env node

import * as project from './utils/project'
import { formatError } from './utils/helpers'
import chalk from 'chalk'

async function main() {
  const args = process.argv
    .slice(2)
    .filter((arg) => arg.startsWith('--'))
    .map((arg) => arg.slice(2).toLowerCase())
  const ctx = await project.initApp(args)
  await project.copyTemplate(ctx)
  await project.modifyProject(ctx)
  await project.installDeps(ctx)
  project.finished(ctx)
}

main().catch((e) => {
  console.log(
    `\n ${chalk.blue('Something went wrong:')} ${chalk.red(formatError(e))}\n`
  )
  process.exit(1)
})
