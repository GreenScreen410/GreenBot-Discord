import chalk from "chalk";
import client from "../../index.js";

client.on("error", (error) => {
  console.log(chalk.red.bold(`[ERROR] ${error.stack}`));
});
