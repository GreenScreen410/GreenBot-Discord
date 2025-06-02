import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, parseEmoji } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('stealemoji')
    .setNameLocalizations({
      ko: '이모지훔치기'
    })
    .setDescription('Steals the emoji from another server.')
    .setDescriptionLocalizations({
      ko: '다른 서버의 이모지를 훔쳐옵니다.'
    })
    .addStringOption(option => option
      .setName('emoji')
      .setNameLocalizations({
        ko: '이모지'
      })
      .setDescription('Please enter an emoji. Default emojis cannot be used.')
      .setDescriptionLocalizations({
        ko: '이모지를 입력해주세요. 기본 이모지는 사용할 수 없습니다.'
      })
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const input = interaction.options.getString('emoji', true)
    const emoji = parseEmoji(input)

    if (emoji === null) {
      return interaction.client.error.INVALID_ARGUMENT(interaction, input)
    }

    const url = `https://cdn.discordapp.com/emojis/${emoji.id}.${emoji.animated ? 'gif' : 'png'}?quality=lossless`
    await interaction.guild.emojis.create({ attachment: url, name: emoji.name })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.stealemoji.title'))
      .setDescription(await interaction.client.i18n(interaction, 'command.stealemoji.description'))
      .setThumbnail(url)
    await interaction.followUp({ embeds: [embed] })
  }
}
