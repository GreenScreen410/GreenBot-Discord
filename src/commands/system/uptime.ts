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
    const startedAt = new Date(Date.now() - process.uptime() * 1000);

    const container = new ContainerBuilder();
    container.addTextDisplayComponents((text) => text.setContent('## ⏱️ 봇 업타임'));
    container.addTextDisplayComponents(
      (text) => text.setContent(`**가동 시간:** ${time(startedAt, TimestampStyles.RelativeTime)}`),
      (text) => text.setContent(`**실행 시작:** ${time(startedAt)}`)
    );

    await interaction.followUp({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
