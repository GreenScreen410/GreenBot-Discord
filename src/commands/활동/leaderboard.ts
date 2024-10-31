import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('leaderboard')
    .setNameLocalizations({
      ko: '순위표'
    })
    .setDescription('Check the various ranking tables.')
    .setDescriptionLocalizations({
      ko: '각종 순위표 상태를 확인합니다.'
    })
    .addStringOption(option => option
      .setName('activity')
      .setNameLocalizations({
        ko: '종목'
      })
      .setDescription('Select the activity to check.')
      .setDescriptionLocalizations({
        ko: '확인할 종목을 선택해 주세요.'
      })
      .addChoices({ name: '국기퀴즈', value: 'flag' })
      .addChoices({ name: '가위바위보', value: 'rps' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const activity = interaction.options.getString('activity', true)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🏆 ${activity} 순위표`)
      .setDescription('이 순위는 모든 서버에 반영됩니다!')

    const result = await interaction.client.mysql.query(`SELECT * FROM activity ORDER BY ${activity} DESC`)
    for (let i = 0; i < 10; i++) {
      const response = await axios.get(`https://canary.discord.com/api/v10/users/${result[i].id}`, { headers: { 'Content-Type': 'application/json', Authorization: `Bot ${interaction.client.token}` } })
      if (i === 0) embed.setThumbnail(`https://cdn.discordapp.com/avatars/${result[i].id}/${response.data.avatar}.png`)
      embed.addFields({ name: `${i + 1}위`, value: `${response.data.global_name}(${response.data.username}): **${result[i][activity]}점**` })
    }
    await interaction.followUp({ embeds: [embed] })
  }
}
