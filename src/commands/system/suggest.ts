import { type ChatInputCommandInteraction, SlashCommandBuilder, ModalBuilder, ActionRowBuilder, type ModalActionRowComponentBuilder, TextInputBuilder, TextInputStyle, type ModalSubmitInteraction, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('suggest')
    .setNameLocalizations({
      ko: '문의'
    })
    .setDescription('Have a question, bug, or feature request? Feel free to ask!')
    .setDescriptionLocalizations({
      ko: '궁금증, 버그 발생, 기능 요청 등 어떠한 질문이든 환영합니다!'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder()
      .setCustomId('suggest')
      .setTitle(await interaction.client.i18n(interaction, 'command.suggest.title'))

    const suggestInput = new TextInputBuilder()
      .setCustomId('suggestInput')
      .setLabel(await interaction.client.i18n(interaction, 'command.suggest.label'))
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1024)
      .setPlaceholder(await interaction.client.i18n(interaction, 'command.suggest.placeholder'))

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(suggestInput)

    modal.addComponents(firstActionRow)

    await interaction.showModal(modal)
  },

  async modal (interaction: ModalSubmitInteraction) {
    await interaction.deferReply()
    const suggest = interaction.fields.getTextInputValue('suggestInput')

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.suggest.title'))
      .setDescription(await interaction.client.i18n(interaction, 'command.suggest.description'))
    await interaction.followUp({ embeds: [embed] })

    const suggestEmbed = new EmbedBuilder()
      .setTitle('새로운 문의가 접수되었습니다.')
      .addFields([
        { name: '문의자', value: `${interaction.user.tag} (${interaction.user.globalName}, ${interaction.user.id})` },
        { name: '문의 내용', value: suggest }
      ])
      .setColor('Random')
      .setTimestamp()
    await interaction.client.users.cache.get(process.env.ADMIN_ID)?.send({ embeds: [suggestEmbed] })
  }
}
