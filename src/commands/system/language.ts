import { type ChatInputCommandInteraction, SlashCommandBuilder, PermissionFlagsBits, EmbedBuilder } from 'discord.js'

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
      .addChoices({ name: '한국어', value: 'ko' })
      .addChoices({ name: 'English', value: 'en_US' })
      .setRequired(true)
    )
    .addBooleanOption(option => option
      .setName('server')
      .setDescription('Do you want to change the language of all users in the server?')
      .setDescriptionLocalizations({
        ko: '서버에 있는 모든 사용자의 언어를 변경하시겠습니까?'
      })
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const oldLanguage = (await interaction.client.mysql.query('SELECT language FROM user WHERE id = ?', [interaction.user.id])).language ?? interaction.locale
    const newLanguage = interaction.options.getString('language')
    const isGuild = interaction.options.getBoolean('server') ?? false

    if (isGuild) {
      if (interaction.memberPermissions?.has(PermissionFlagsBits.ManageGuild) === false) {
        return interaction.client.error.NO_PERMISSION(interaction, 'ManageGuild')
      }
      await interaction.client.mysql.query('INSERT INTO guild (id, locale) VALUES (?, ?) ON DUPLICATE KEY UPDATE locale = ?', [interaction.guildId, newLanguage, newLanguage]
      )
    } else {
      await interaction.client.mysql.query('INSERT INTO user (id, language) VALUES (?, ?) ON DUPLICATE KEY UPDATE language = ?', [interaction.user.id, oldLanguage, newLanguage])
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.language.title'))
      .setDescription(await interaction.client.i18n(interaction, 'command.language.description', { oldLanguage, newLanguage }))
    await interaction.followUp({ embeds: [embed] })
  }
}
