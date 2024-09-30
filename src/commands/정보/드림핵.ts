import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { load } from 'cheerio'

export default {
  data: new SlashCommandBuilder()
    .setName('드림핵')
    .setDescription('드림핵 워게임 문제 정보를 가져옵니다.')
    .addStringOption((option) => option
      .setName('문제')
      .setDescription('문제 이름을 입력해 주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const server = interaction.options.getString('문제', true)
    const response = await axios.get(`https://dreamhack.io/wargame?search=${encodeURIComponent(server)}&page=1`)

    const $ = load(response.data as string)
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${$('#wargame-challenges > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-title > a > span').text()}`)
      .setURL(`https://dreamhack.io${$('#wargame-challenges > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-title > a').attr('href')}`)
      .setDescription(`${$('#wargame-challenges > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-category.hide-mobile > span').text()}`)
      .addFields(
        { name: '풀이 수', value: `${$('#wargame-challenges > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-solvers').text()}`, inline: true },
        { name: '출제자', value: `${$('#wargame-challenges > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-author > div > div > div > a > span').text()}`, inline: true }
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    await interaction.followUp({ embeds: [embed] })
  }
}
