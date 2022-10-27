import { BaseInteraction } from "discord.js";
import chalk from "chalk";
import client from "../../index.js"
import ERROR from "../../handler/ERROR.js";

client.on("interactionCreate", async (interaction: BaseInteraction) => {
  if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return;

  const command = client.commands.get(interaction.commandName);
  await interaction.deferReply();

  if (!command) {
    return ERROR.INVALID_INTERACTION(interaction);
  } else {
    command.run(client, interaction);
    console.log(chalk.white(`[COMMAND] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
  }
});