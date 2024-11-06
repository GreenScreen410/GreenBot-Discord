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
      return await interaction.client.error.INVALID_ARGUMENT(interaction, input)
    }

    const url = emoji.animated ? `https://cdn.discordapp.com/emojis/${emoji.id}.gif?quality=lossless` : `https://cdn.discordapp.com/emojis/${emoji.id}.png?quality=lossless`
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🥷🏻 이모지 훔치기')
      .setDescription('이모지를 성공적으로 훔쳐왔습니다!')
      .setThumbnail(url)
    await interaction.followUp({ embeds: [embed] })

    await interaction.guild.emojis.create({ attachment: url, name: emoji.name })
  }
}
