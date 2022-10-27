import chalk from "chalk";
import client from "../../index.js";

client.on("warn", (message) => {
  console.log(chalk.yellow.bold(`[WARN] ${message}`));
});
