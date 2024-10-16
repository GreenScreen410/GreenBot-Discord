import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } from 'discord.js'
import axios from 'axios'
import country from '../../country.json' assert { type: 'json' }

export default {
  data: new SlashCommandBuilder()
    .setName('국기퀴즈')
    .setDescription('256개의 국기 퀴즈를 풀어보세요!'),

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
      .setTitle('아래 국기는 어디 국기일까요?')

    await interaction.followUp({ embeds: [embed], components: [multipleRow] })

    const collector: any = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 })
    collector.on('collect', async (i: any) => {
      await i.deferUpdate()

      const result = await interaction.client.mysql.query(`SELECT flag_quiz FROM activity WHERE id = ${i.user.id}`)
      if (i.customId === 'correct') {
        await interaction.client.mysql.query(`UPDATE activity SET flag_quiz = ${result.flag_quiz + 1} WHERE id = ${i.user.id}`)

        const correctEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle(`✅ ${i.user.tag}님 정답!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.\n현재 점수: **${result.flag_quiz + 1}**점`)

          .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() })
        await interaction.followUp({ embeds: [correctEmbed] })
        collector.stop()
      } else {
        const wrongEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(`❌ ${i.user.tag}님 오답!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.\n현재 점수: **${result.flag_quiz}**점`)
          .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() })
        await interaction.followUp({ embeds: [wrongEmbed] })
        collector.stop()
      }
    })

    collector?.on('end', async (collected: any) => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setTitle(`⏰ ${interaction.user.tag}님 시간 초과!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.`)
        await interaction.followUp({ embeds: [timeoutEmbed] })
      }
    })
  }
}
