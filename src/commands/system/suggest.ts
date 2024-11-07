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
      .setTitle('어떤 도움이 필요하신가요?')

    const suggestInput = new TextInputBuilder()
      .setCustomId('suggestInput')
      .setLabel('문의 내용')
      .setStyle(TextInputStyle.Paragraph)
      .setMaxLength(1024)
      .setPlaceholder('어떠한 질문이든 환영합니다!')

    const firstActionRow = new ActionRowBuilder<ModalActionRowComponentBuilder>().addComponents(suggestInput)

    modal.addComponents(firstActionRow)

    await interaction.showModal(modal)
  },

  async modal (interaction: ModalSubmitInteraction) {
    await interaction.deferReply()
    const suggest = interaction.fields.getTextInputValue('suggestInput')

    const embed = new EmbedBuilder()
      .setTitle('✉️ 성공적으로 문의가 접수되었습니다.')
      .setDescription('답장은 DM으로 전송될 예정입니다. 빠른 시일 내에 답변드리겠습니다.')
      .setColor('Random')
    await interaction.followUp({ embeds: [embed] })

    const suggestEmbed = new EmbedBuilder()
      .setTitle('새로운 문의가 접수되었습니다.')
      .addFields([
        { name: '문의자', value: `${interaction.user.tag} (${interaction.user.globalName}, ${interaction.user.id})` },
        { name: '문의 내용', value: suggest }
      ])
      .setColor('Random')
      .setTimestamp()
    await interaction.client.users.cache.get(process.env.ADMIN_ID)!.send({ embeds: [suggestEmbed] })
  }
}
