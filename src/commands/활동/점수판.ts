import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import 'dotenv/config.js'
import mysql from 'mysql2/promise'

export default {
  data: new SlashCommandBuilder()
    .setName('점수판')
    .setDescription('[베타] 활동 점수판을 확인합니다.')
    .addStringOption(option => option
      .setName('종목')
      .setDescription('종목을 선택해 주세요.')
      .addChoices({ name: '국기퀴즈', value: 'flag_quiz' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: 'ubuntu',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    const activity = interaction.options.getString('종목')

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🏆 국기퀴즈 순위표')
      .setDescription('이 순위는 모든 서버에 반영됩니다!')
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    if (activity === 'flag_quiz') {
      const [result]: any = await connection.query(`SELECT * FROM activity ORDER BY ${activity} DESC`)
      for (let i = 0; i < result.length; i++) {
        embed.addFields({ name: `${i + 1}위`, value: `<@${result[i].id}>: ${result[i].flag_quiz}점` })
      }
      await interaction.followUp({ embeds: [embed] })
    }

    await connection.end()
  }
}
