import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } from 'discord.js'
import axios from 'axios'
import country from '../../country.json' with { type: 'json' }

export default {
  data: new SlashCommandBuilder()
    .setName('guesstheflag')
    .setNameLocalizations({
      ko: '국기맞추기'
    })
    .setDescription('Guess the flag of 256 random countries! Some non-country flags are included.')
    .setDescriptionLocalizations({
      ko: '256개의 랜덤한 국기를 맞춰보세요! 국가가 아닌 것도 일부 포함되어 있습니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const countryCodes = Object.keys(country)
    const randomIndex = (): number => Math.floor(Math.random() * countryCodes.length)

    const countryCode = countryCodes[randomIndex()]
    let wrongCountryCode1 = countryCodes[randomIndex()]
    let wrongCountryCode2 = countryCodes[randomIndex()]

    while (wrongCountryCode1 === countryCode || wrongCountryCode2 === countryCode || wrongCountryCode1 === wrongCountryCode2) {
      wrongCountryCode1 = countryCodes[randomIndex()]
      wrongCountryCode2 = countryCodes[randomIndex()]
    }

    const correctCountryName = country[countryCode as keyof typeof country]
    const correctButton = new ButtonBuilder()
      .setCustomId('correct')
      .setLabel(correctCountryName)
      .setStyle(1)
    const wrongCountryName1 = country[wrongCountryCode1 as keyof typeof country]
    const wrongButton1 = new ButtonBuilder()
      .setCustomId('wrong1')
      .setLabel(wrongCountryName1)
      .setStyle(1)
    const wrongCountryName2 = country[wrongCountryCode2 as keyof typeof country]
    const wrongButton2 = new ButtonBuilder()
      .setCustomId('wrong2')
      .setLabel(wrongCountryName2)
      .setStyle(1)
    const multipleRow = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(...[correctButton, wrongButton1, wrongButton2].sort(() => Math.random() - 0.5))

    const image = await axios.get(`https://flagcdn.com/w320/${countryCode}.png`)
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(image.request.res.responseUrl as string)
      .setTitle(await interaction.client.locale(interaction, 'command.guesstheflag.title'))
    await interaction.followUp({ embeds: [embed], components: [multipleRow] })

    const collector: any = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 })
    collector.on('collect', async (i: any) => {
      await i.deferUpdate()

      const result = await interaction.client.mysql.query('SELECT flag FROM activity WHERE id = ?', [i.user.id])
      if (i.customId === 'correct') {
        await interaction.client.mysql.query('UPDATE activity SET flag = ? WHERE id = ?', [result.flag + 1, i.user.id])

        const correctEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle(await interaction.client.locale(interaction, 'command.guesstheflag.correct', { user: i.user.tag }))
          .setDescription(await interaction.client.locale(interaction, 'command.guesstheflag.description', { country: correctCountryName, score: result.flag + 1 }))
        await interaction.followUp({ embeds: [correctEmbed] })
        collector.stop()
      } else {
        const wrongEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(await interaction.client.locale(interaction, 'command.guesstheflag.wrong', { user: i.user.tag }))
          .setDescription(await interaction.client.locale(interaction, 'command.guesstheflag.description', { country: correctCountryName, score: result.flag }))
        await interaction.followUp({ embeds: [wrongEmbed] })
        collector.stop()
      }
    })

    collector.on('end', async (collected: any) => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setTitle(await interaction.client.locale(interaction, 'command.guesstheflag.timeout'))
          .setDescription(await interaction.client.locale(interaction, 'command.guesstheflag.timeout_description', { country: correctCountryName }))
        await interaction.followUp({ embeds: [timeoutEmbed] })
      }
    })
  }
}
