import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('statistics')
    .setNameLocalizations({
      ko: '통계'
    })
    .setDescription('Shows overall statistics of the bot.')
    .setDescriptionLocalizations({
      ko: '봇의 전체적인 통계를 보여줍니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    let totalSeconds = (interaction.client.uptime / 1000)
    const days = Math.floor(totalSeconds / 86400)
    totalSeconds %= 86400
    const hours = Math.floor(totalSeconds / 3600)
    totalSeconds %= 3600
    const minutes = Math.floor(totalSeconds / 60)
    const seconds = Math.floor(totalSeconds % 60)

    const date = new Date()
    const totalCommand = await interaction.client.mysql.query('SELECT count FROM statistics WHERE event="total_command"')
    const uniqueUser = await interaction.client.mysql.query('SELECT COUNT(*) FROM user')

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('📊 그린Bot 통계')
      .setDescription(`${String(date.getFullYear() + '년 ') + ('0' + (date.getMonth() + 1)).slice(-2) + '월 ' + ('0' + date.getDate()).slice(-2) + '일 ' + ('0' + date.getHours()).slice(-2) + '시 ' + ('0' + date.getMinutes()).slice(-2) + '분 ' + ('0' + date.getSeconds()).slice(-2) + '초 '} 기준`)
      .addFields(
        { name: '📊 전체 서버 수', value: `${interaction.client.guilds.cache.size}개`, inline: true },
        { name: '👥 전체 유저 수', value: `${interaction.client.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)}명`, inline: true },
        { name: '👥 고유 유저 수', value: `${uniqueUser['COUNT(*)']}명`, inline: true },
        { name: '📜 전체 채널 수', value: `${interaction.client.channels.cache.size}개`, inline: true },
        { name: '🔧 전체 명령어 수', value: `${interaction.client.commands.size}개`, inline: true },
        { name: '🔧 총 명령어 실행 횟수', value: `${totalCommand.count}회`, inline: true },
        { name: '🕒 가동 시간', value: `${days}일 ${hours}시간  ${minutes}분 ${seconds}초`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
