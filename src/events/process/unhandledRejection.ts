import chalk from 'chalk'

process.on('unhandledRejection', (error: Error) => {
  console.log(chalk.red.bold(`[UnhandledRejection] ${error.stack}`))
})
