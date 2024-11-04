import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

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
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.ping.title'))
      .setDescription(await interaction.client.locale(interaction, 'command.ping.description', { ping: interaction.client.ws.ping }))
    await interaction.followUp({ embeds: [embed] })
  }
}
