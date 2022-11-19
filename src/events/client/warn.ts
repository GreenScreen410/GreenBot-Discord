import chalk from "chalk";
import client from "../../index.js";

client.on("warn", (info) => {
  console.log(chalk.yellow.bold(`[WARN] ${info}`));
});
