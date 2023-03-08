import path from 'path'
import fs from 'fs-extra'
import ora from 'ora'
import inquirer from 'inquirer'
import chalk from 'chalk'
import { existsOrCreate, overWriteFile } from './files'
import {
  execa,
  formatError,
  validateName,
  getUserPackageManager,
  updateJson,
} from './helpers'
import type { IAppCtx, ITemplate } from '~types'

export async function initApp(args: string[]): Promise<IAppCtx> {
  console.log()
  let pName = args
    .find((o) => o.startsWith('pname='))
    ?.split('pname=')
    .pop()
  if (pName && !validateName(pName)) {
    pName = undefined
  }
  const appName =
    pName ||
    (
      await inquirer.prompt<{ appName: string }>({
        name: 'appName',
        type: 'input',
        message: 'What is the name of the app?',
        validate: validateName,
        default: 'my-app',
      })
    ).appName
  const useCurrentDir = args.includes('current')
  const userDir = path.resolve(process.cwd(), useCurrentDir ? '' : appName)
  const exists = await existsOrCreate(userDir)
  if (exists && !useCurrentDir) {
    if (
      (
        await inquirer.prompt<{ overWrite: boolean }>({
          name: 'overWrite',
          type: 'confirm',
          message: `Do you want to overwrite this directory?`,
        })
      ).overWrite
    ) {
      await overWriteFile(userDir)
    } else {
      console.log(chalk.red('Aborting...'))
      process.exit(1)
    }
  }

  const templateDir = path.join(__dirname, '../../templates')
  const possibleTemplates = await fs.readdir(templateDir)

  const { template } = await inquirer.prompt<{
    template: ITemplate
  }>({
    type: 'list',
    choices: possibleTemplates,
    name: 'template',
    message: 'What template do you want to use?',
  })
  const pkgManager = getUserPackageManager()
  return {
    appName,
    userDir,
    pkgManager,
    templateDir,
    template,
  }
}

export async function copyTemplate(appContext: IAppCtx) {
  console.log()
  const spinner = ora('Copying template files').start()
  try {
    await fs.copy(
      path.join(appContext.templateDir, appContext.template),
      path.join(appContext.userDir)
    )
    await fs.rename(
      path.join(appContext.userDir, '_gitignore'),
      path.join(appContext.userDir, '.gitignore')
    )
    spinner.succeed(`Copied template files to ${appContext.userDir}`)
  } catch (e) {
    spinner.fail(`Couldn't copy template files: ${formatError(e)}`)
    process.exit(1)
  }
}
export async function modifyProject(ctx: IAppCtx) {
  const spinner = ora('Modifying project').start()
  try {
    await Promise.all([updateJson(ctx)])
    spinner.succeed('Modified project')
  } catch (e) {
    spinner.fail(`Couldn't modify project: ${formatError(e)}`)
    process.exit(1)
  }
}

export async function installDeps(ctx: IAppCtx) {
  console.log(
    `\n${chalk.blue('Using')} ${chalk.bold(
      chalk.yellow(ctx.pkgManager.toUpperCase())
    )} ${chalk.bold(chalk.blue('as package manager'))}`
  )
  const spinner = ora('Installing dependencies').start()
  try {
    const flags = ctx.pkgManager === 'npm' ? ' --legacy-peer-deps' : ''
    await execa(`${ctx.pkgManager} install${flags}`, { cwd: ctx.userDir })
    spinner.succeed('Installed dependencies')
  } catch (e) {
    spinner.fail(`Couldn't install dependencies: ${formatError(e)}`)
    process.exit(1)
  }
}

export function finished(ctx: IAppCtx) {
  console.log(`\n\t${chalk.green(`cd ${ctx.appName}`)}`)
  const withRun = ctx.pkgManager === 'pnpm' ? '' : ' run'
  console.log(chalk.bold(chalk.blue(`\t${ctx.pkgManager}${withRun} dev`)))
  console.log()
  process.exit(0)
}
