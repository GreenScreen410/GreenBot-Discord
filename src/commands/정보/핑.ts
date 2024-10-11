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
      .setColor('#FF0000')
      .setTitle('🏓 퐁!')
      .setDescription(`반응 속도: ${interaction.client.ws.ping}ms`)
    await interaction.followUp({ embeds: [embed] })
  }
}
