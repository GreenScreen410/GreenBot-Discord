import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, type TextChannel } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('announcement')
    .setNameLocalizations({
      ko: '공지사항'
    })
    .setDescription('Check the latest announcement from the official channel of GreenBot.')
    .setDescriptionLocalizations({
      ko: '그린Bot 공식 채널의 최신 공지사항을 확인합니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const channel = await interaction.client.channels.fetch('1104454589798957187') as TextChannel
    const messages = await channel.messages.fetch({ limit: 1 })
    const lastMessage = messages.first()
    if (lastMessage == null) {
      return await interaction.client.error.UNKNOWN_ERROR(interaction, '최신 메시지를 불러오는 중 오류가 발생했습니다.')
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('최신 메시지')
      .setDescription(lastMessage.content)
      .addFields(
        { name: '작성자', value: lastMessage.author.tag },
        { name: '작성 시간', value: lastMessage.createdAt.toLocaleString() }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
