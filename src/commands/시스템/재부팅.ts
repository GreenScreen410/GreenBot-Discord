import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('재부팅')
    .setDescription('[개발자] 봇을 재부팅합니다.'),

  async execute (interaction: ChatInputCommandInteraction) {
    if (interaction.user.id !== '332840377763758082') {
      return interaction.client.error.NO_PERMISSION
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🔄 재부팅 중...')
      .setDescription('봇을 재부팅합니다.')
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    await interaction.followUp({ embeds: [embed] })

    process.exit(0)
  }
}
