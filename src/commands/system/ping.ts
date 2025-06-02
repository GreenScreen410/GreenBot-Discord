import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { performance } from 'perf_hooks'

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

  async execute (interaction: ChatInputCommandInteraction) {
    const start = performance.now()

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.ping.title'))
      .setDescription(await interaction.client.i18n(interaction, 'command.ping.description'))
      .addFields(
        { name: 'API', value: `${interaction.client.ws.ping}ms`, inline: true },
        { name: 'RTT', value: `${Math.round(performance.now() - start)}ms`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
