import chalk from "chalk";

process.on("uncaughtException", (error) => {
  console.log(chalk.red.bold(`[UNCAUGHT_EXCEPTION] ${error}`))
});
