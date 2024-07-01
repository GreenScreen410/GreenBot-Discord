import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ComponentType } from 'discord.js'
import axios from 'axios'
import 'dotenv/config.js'
import mysql from 'mysql2/promise'
import country from '../../country.json' assert { type: 'json' }

export default {
  data: new SlashCommandBuilder()
    .setName('국기퀴즈')
    .setDescription('256개의 국기 퀴즈를 풀어보세요!'),

  async execute (interaction: ChatInputCommandInteraction) {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: 'ubuntu',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

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
    const correctButton = new ButtonBuilder().setCustomId('correct').setLabel(correctCountryName).setStyle(1)
    const wrongCountryName1 = country[wrongCountryCode1 as keyof typeof country]
    const wrongButton1 = new ButtonBuilder().setCustomId('wrong1').setLabel(wrongCountryName1).setStyle(1)
    const wrongCountryName2 = country[wrongCountryCode2 as keyof typeof country]
    const wrongButton2 = new ButtonBuilder().setCustomId('wrong2').setLabel(wrongCountryName2).setStyle(1)
    const multipleRow = new ActionRowBuilder<ButtonBuilder>().addComponents(...[correctButton, wrongButton1, wrongButton2].sort(() => Math.random() - 0.5))

    const image = await axios.get(`https://flagcdn.com/w320/${countryCode}.png`)
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setImage(image.request.res.responseUrl as string)
      .setTitle('아래 국기는 어디 국기일까요?')
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    await interaction.followUp({ embeds: [embed], components: [multipleRow] })

    const collector = interaction.channel?.createMessageComponentCollector({ componentType: ComponentType.Button, time: 10000 })
    collector?.on('collect', async i => {
      await i.deferUpdate()

      const [result]: any = await connection.query(`SELECT * FROM activity WHERE id=${i.user.id}`)
      if (result.length === 0) {
        await connection.query(`INSERT INTO activity(id, flag_quiz) VALUES (${i.user.id}, 0)`)
      }

      if (i.customId === 'correct') {
        await connection.query(`UPDATE activity SET flag_quiz=${result[0].flag_quiz + 1} WHERE id=${i.user.id}`)

        const correctEmbed = new EmbedBuilder()
          .setColor('#00FF00')
          .setTitle(`✅ ${i.user.tag}님 정답!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.\n현재 점수: **${result[0].flag_quiz + 1}**점`)
          .setTimestamp()
          .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() })
        await interaction.followUp({ embeds: [correctEmbed] })
        collector.stop()

        if (result[0].flag_quiz + 1 >= 5) {
          await interaction.client.achievements.get(interaction, 'flag_quiz_1')
          if (result[0].flag_quiz + 1 >= 25) {
            await interaction.client.achievements.get(interaction, 'flag_quiz_2')
            if (result[0].flag_quiz + 1 >= 50) {
              await interaction.client.achievements.get(interaction, 'flag_quiz_3')
              if (result[0].flag_quiz + 1 >= 100) {
                await interaction.client.achievements.get(interaction, 'flag_quiz_4')
                if (result[0].flag_quiz + 1 >= 200) {
                  await interaction.client.achievements.get(interaction, 'flag_quiz_5')
                }
              }
            }
          }
        }
        await connection.end()
      } else {
        const wrongEmbed = new EmbedBuilder()
          .setColor('#FF0000')
          .setTitle(`❌ ${i.user.tag}님 오답!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.\n현재 점수: **${result[0].flag_quiz}**점`)
          .setTimestamp()
          .setFooter({ text: `Requested by ${i.user.tag}`, iconURL: i.user.displayAvatarURL() })
        await interaction.followUp({ embeds: [wrongEmbed] })
        collector.stop()
        await connection.end()
      }
    })

    collector?.on('end', async collected => {
      if (collected.size === 0) {
        const timeoutEmbed = new EmbedBuilder()
          .setColor('#FFFF00')
          .setTitle(`⏰ ${interaction.user.tag}님 시간 초과!`)
          .setDescription(`정답은 **'${correctCountryName}'** 이였습니다.`)
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
        await interaction.followUp({ embeds: [timeoutEmbed] })
        await connection.end()
      }
    })
  }
}
