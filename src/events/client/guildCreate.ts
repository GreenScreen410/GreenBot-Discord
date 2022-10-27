import chalk from "chalk";
import client from "../../index.js";

client.on("guildCreated", (guild) => {
  console.log(chalk.green.bold(`[GUILD_CREATE] Invited to ${guild.name}(${guild.id})`));
});
