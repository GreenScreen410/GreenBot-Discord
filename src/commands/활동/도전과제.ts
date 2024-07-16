import 'dotenv/config'
import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import mysql from 'mysql2/promise'
import achievements from '../../achievements.json' assert { type: 'json' }

export default {
  data: new SlashCommandBuilder()
    .setName('도전과제')
    .setDescription('여러 명령어들을 입력하고, 보고, 실행하며 도전과제들을 달성해보세요!'),

  async execute (interaction: ChatInputCommandInteraction) {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: 'ubuntu',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    return await interaction.followUp('도전과제 명령어 보수 중입니다.')
    const [result]: any = await connection.query(`SELECT * FROM achievements WHERE id=${interaction.user.id}`)
    if (result[0].length === 0) {
      await connection.query(`INSERT INTO achievements(id, first_step) VALUES (${interaction.user.id}, 1)`)

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('⭐ 도전과제 획득!')
        .setDescription(`'첫걸음' 도전과제를 획득하셨어요!\n\n획득 조건: ${achievements[0].condition}\n${achievements[0].description}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      await interaction.followUp({ embeds: [embed] })
    } else {
      let description = `<@${interaction.user.id}>님이 획득하신 도전과제입니다.\n\n`
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('⭐ 획득한 도전과제')
      for (let i = 0; i < Object.keys(achievements).length; i++) {
        if (result[0][achievements[i].id] === 0) {
          description += `**${achievements[i].name}** - ?\n`
        } else {
          description += `**${achievements[i].name}** - ${achievements[i].description}\n`
        }
      }
      embed.setDescription(description)
      await interaction.followUp({ embeds: [embed] })
    }

    await connection.end()
  }
}
