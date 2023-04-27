import { Events, Guild } from "discord.js";
import chalk from "chalk";

export default {
  name: Events.GuildCreate,

  execute(guild: Guild) {
    console.log(chalk.green.bold(`[GUILD_CREATE] Invited to ${guild.name}(${guild.id})`));
  }
}