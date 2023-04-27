import { Events } from "discord.js";
import chalk from "chalk";

export default {
  name: Events.Error,

  execute(error: Error) {
    console.log(chalk.red.bold(`[ERROR] ${error.stack}`));
  }
}