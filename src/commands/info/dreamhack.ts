import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'
import { load } from 'cheerio'

export default {
  data: new SlashCommandBuilder()
    .setName('dreamhack')
    .setNameLocalizations({
      ko: '드림핵'
    })
    .setDescription('Get information about DreamHack wargame problems.')
    .setDescriptionLocalizations({
      ko: '드림핵 워게임 문제 정보를 가져옵니다.'
    })
    .addStringOption((option) => option
      .setName('problem')
      .setNameLocalizations({
        ko: '문제'
      })
      .setDescription('Enter the name of the problem.')
      .setDescriptionLocalizations({
        ko: '문제 이름을 입력해 주세요.'
      })
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const problem = interaction.options.getString('problem')
    const response = await axios.get(`https://dreamhack.io/wargame?search=${problem}&page=1`)
    const $ = load(response.data as string)
    const embed = new EmbedBuilder()
      .setTitle(`${$('#__layout > div > main > section > div > div:nth-child(3) > div.left-col.col-sm-8 > div > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-title > a > span').text()}`)
      .setURL(`https://dreamhack.io${$('#__layout > div > main > section > div > div:nth-child(3) > div.left-col.col-sm-8 > div > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-title > a').attr('href')}`)
      .setDescription(`${$('#__layout > div > main > section > div > div:nth-child(3) > div.left-col.col-sm-8 > div > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-category.hide-mobile > span').text()}`)
      .addFields(
        { name: '풀이 수', value: `${$('#__layout > div > main > section > div > div:nth-child(3) > div.left-col.col-sm-8 > div > div.challenges-list.challenge-list > div:nth-child(2) > div.challenge-solvers').text()}`, inline: true },
        { name: '출제자', value: `${$('#\\31 53-popover-3 > span').text()}`, inline: true }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
