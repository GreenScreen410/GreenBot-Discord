import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('순위표')
    .setDescription('각종 순위표 상태를 확인합니다.')
    .addStringOption(option => option
      .setName('종목')
      .setDescription('종목을 선택해 주세요.')
      .addChoices({ name: '국기퀴즈', value: 'flag_quiz' })
      .addChoices({ name: '가위바위보', value: 'rock_paper_scissors' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const activity = interaction.options.getString('종목')

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🏆 ${activity} 순위표`)
      .setDescription('이 순위는 모든 서버에 반영됩니다!')

    const result = await interaction.client.mysql.query(`SELECT * FROM activity ORDER BY ${activity} DESC`)
    for (let i = 0; i < 10; i++) {
      embed.addFields({ name: `${i + 1}위`, value: `<@${result[i].id}>: ${result[i].flag_quiz}점` })
    }
    await interaction.followUp({ embeds: [embed] })
  }
}
