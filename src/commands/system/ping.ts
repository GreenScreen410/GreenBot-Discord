import { performance } from 'node:perf_hooks';
import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('ping')
    .setNameLocalizations({
      ko: '핑'
    })
    .setDescription('Check the message response speed.')
    .setDescriptionLocalizations({
      ko: '메시지 반응 속도를 확인합니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    const start = performance.now();
    await interaction.deferReply();
    const rtt = Math.round(performance.now() - start);

    const container = new ContainerBuilder()
      .addTextDisplayComponents((text) => text.setContent(`## ${interaction.i18n('command.ping.title')}`))
      .addSeparatorComponents((separator) => separator.setDivider(true))
      .addTextDisplayComponents((text) =>
        text.setContent(`🌐 WebSocket: **${interaction.client.ws.ping === -1 ? 'N/A' : `${interaction.client.ws.ping}ms`}**\n⚡ API: **${rtt}ms**`)
      );

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
