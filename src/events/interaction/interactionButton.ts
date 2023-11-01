import { Events, BaseInteraction } from 'discord.js';
import chalk from 'chalk';

export default {
  name: Events.InteractionCreate,

  async execute(interaction: BaseInteraction) {
    if (!interaction.isButton() || !interaction.inCachedGuild()) return;

    /*
    const button = interaction.client.buttons.get(interaction.customId);
    await interaction.deferReply();

    if (!button) return interaction.client.error.INVALID_INTERACTION(interaction);
    try {
      await button.execute(interaction);
      console.log(chalk.white(`[BUTTON] ${interaction.guild.name}(${interaction.guild.id}) - ${interaction.user.tag}(${interaction.user.id}) executed ${button.data.data.label}`))
    } catch (error: any) {
      console.log(error);
      return interaction.client.error.UNKNOWN_ERROR(interaction, error);
    }
    */
  }
}
