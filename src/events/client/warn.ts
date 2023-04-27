import { Events } from "discord.js";
import chalk from "chalk";

export default {
  name: Events.Warn,

  execute(warn: string) {
    console.log(chalk.yellow.bold(`[WARN] ${warn}`));
  }
}