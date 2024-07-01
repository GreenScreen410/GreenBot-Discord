import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('가동시간')
    .setDescription('봇의 가동 시간을 확인합니다.'),

  async execute (interaction: ChatInputCommandInteraction) {
    let totalSeconds = (interaction.client.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🕘 가동 시간')
      .setDescription(`${days}일 ${hours}시간  ${minutes}분 ${seconds}초`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    await interaction.followUp({ embeds: [embed] })

    if (interaction.client.uptime / 1000 >= 10080) {
      await interaction.client.achievements.get(interaction, 'uptime_1')

      if (interaction.client.uptime / 1000 >= 20160) {
        await interaction.client.achievements.get(interaction, 'uptime_2')
      }
    }
  }
}
