import { ButtonInteraction } from "discord.js";
import chalk from "chalk";
import client from "../../index.js"
import ERROR from "../../handler/ERROR.js";

export default {
  name: "interactionCreate",

  run: async (interaction: ButtonInteraction<"cached">) => {
    if (!interaction.isButton()) return;

    const button = client.buttons.get(interaction.customId);
    await interaction.deferReply();

    if (!button) {
      return ERROR.INVALID_INTERACTION(interaction);
    } else {
      button.run(client, interaction);
      console.log(chalk.white(`[BUTTON] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${button.data.data.label}`))
    }
  },
}