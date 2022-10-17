import { ChatInputCommandInteraction } from "discord.js";
import chalk from "chalk";
import client from "../../index.js"
import ERROR from "../../handler/ERROR.js";

export default {
  name: "interactionCreate",

  run: async (interaction: ChatInputCommandInteraction<"cached">) => {
    if (!interaction.isCommand()) return;

    const command = client.commands.get(interaction.commandName);
    await interaction.deferReply();

    if (!command) {
      return ERROR.INVALID_INTERACTION(client, interaction);
    } else {
      command.run(client, interaction);
      console.log(chalk.white(`[COMMAND] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
    }
  },
}