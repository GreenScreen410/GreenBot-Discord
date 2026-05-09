import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder, TimestampStyles, time } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('uptime')
    .setNameLocalizations({
      ko: '업타임'
    })
    .setDescription('Shows the bot uptime.')
    .setDescriptionLocalizations({
      ko: '봇의 가동 시간을 보여줍니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const startedAt = new Date(Date.now() - process.uptime() * 1000);

    const container = new ContainerBuilder()
      .addTextDisplayComponents((text) => text.setContent(`## ⏱️ ${interaction.i18n('command.uptime.title')}`))
      .addTextDisplayComponents(
        (text) => text.setContent(`**${interaction.i18n('command.uptime.uptime')}:** ${time(startedAt, TimestampStyles.RelativeTime)}`),
        (text) => text.setContent(`**${interaction.i18n('command.uptime.startedAt')}:** ${time(startedAt)}`)
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
