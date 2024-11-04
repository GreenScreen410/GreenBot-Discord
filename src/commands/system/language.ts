import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('language')
    .setNameLocalizations({
      ko: '언어'
    })
    .setDescription('Change the language of the bot.')
    .setDescriptionLocalizations({
      ko: '봇의 언어를 변경합니다.'
    })
    .addStringOption(option => option
      .setName('language')
      .setNameLocalizations({
        ko: '언어'
      })
      .setDescription('Select a language.')
      .setDescriptionLocalizations({
        ko: '언어를 선택해 주세요.'
      })
      .setRequired(true)
      .addChoices({ name: '한국어', value: 'ko' })
      .addChoices({ name: 'English', value: 'en_US' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const oldLanguage = (await interaction.client.mysql.query('SELECT language FROM user WHERE id = ?', [interaction.user.id])).language
    const newLanguage = interaction.options.getString('language')
    await interaction.client.mysql.query('UPDATE user SET language = ? WHERE id = ?', [newLanguage, interaction.user.id])

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.language.title'))
      .setDescription(await interaction.client.locale(interaction, 'command.language.description', { oldLanguage, newLanguage }))
    await interaction.followUp({ embeds: [embed] })
  }
}
