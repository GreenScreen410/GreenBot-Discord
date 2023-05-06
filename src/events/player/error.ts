import { GuildQueue } from "discord-player";
import chalk from "chalk";

export default {
  name: "error",

  execute(queue: GuildQueue, error: Error) {
    console.log(chalk.red.bold(`[PLAYER_ERROR] ${error.stack}`));
  }
}
