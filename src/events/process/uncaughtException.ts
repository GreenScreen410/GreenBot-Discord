import chalk from "chalk";

process.on("uncaughtException", (error: Error) => {
  console.log(chalk.red.bold(`[UNCAUGHT_EXCEPTION] ${error.stack}`));
});
