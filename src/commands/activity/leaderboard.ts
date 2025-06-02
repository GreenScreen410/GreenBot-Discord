import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

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
      .addChoices({
        name: 'Guess the Flag',
        name_localizations: {
          ko: '국기맞추기'
        },
        value: 'flag'
      })
      .addChoices({
        name: 'Rock paper scissors',
        name_localizations: {
          ko: '가위바위보'
        },
        value: 'rps'
      })
      .addChoices({
        name: 'Money',
        name_localizations: {
          ko: '돈'
        },
        value: 'money'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const activity = interaction.options.getString('activity', true)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.leaderboard.title', { activity }))
      .setDescription(await interaction.client.i18n(interaction, 'command.leaderboard.description'))

    const result = await interaction.client.prisma.activity.findMany({
      orderBy: { [activity]: 'desc' },
      take: 10
    })
    for (let i = 0; i < result.length; i++) {
      const user = await interaction.client.users.fetch(result[i].id as string)
      const avatarUrl = user.displayAvatarURL({ extension: 'png', size: 512 })

      if (i === 0) embed.setThumbnail(avatarUrl)
      embed.addFields(
        { name: `${i + 1}`, value: `${user.globalName ?? user.username}: **${(result[i][activity]).toLocaleString()}**` }
      )
    }
    await interaction.followUp({ embeds: [embed] })
  }
}
