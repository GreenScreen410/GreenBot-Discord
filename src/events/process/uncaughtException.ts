import chalk from 'chalk'

process.on('uncaughtException', (error: Error) => {
  console.log(chalk.red.bold(`[UncaughtException] ${error.stack}`))
})
