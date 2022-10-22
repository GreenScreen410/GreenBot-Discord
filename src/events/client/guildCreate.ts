import { Guild } from "discord.js";
import chalk from "chalk";

export default {
  name: "guildCreate",

  run: async (guild: Guild) => {
    console.log(chalk.green.bold(`[GUILD_CREATE] Invited to ${guild.name}(${guild.id})`));
  },
}
