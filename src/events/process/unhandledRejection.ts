import chalk from "chalk";

process.on("unhandledRejection", (error) => {
  console.log(chalk.red.bold(`[UNHANDLED_REJECTION] ${error}`))
});
