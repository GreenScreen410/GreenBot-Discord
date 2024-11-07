import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ButtonBuilder, ButtonStyle, ActionRowBuilder } from 'discord.js'
import axios from 'axios'
import OpenAI from 'openai'

export default {
  data: new SlashCommandBuilder()
    .setName('wyr')
    .setNameLocalizations({
      ko: '밸런스게임'
    })
    .setDescription('Choose one of two options.')
    .setDescriptionLocalizations({
      ko: '두 가지 선택지 중 하나를 골라주세요.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const response: any = (await axios.get('https://api.gamecord.xyz/wyr')).data
    const client = new OpenAI({ baseURL: 'https://glhf.chat/api/openai/v1', apiKey: process.env.GLHF_API_KEY })
    const completion: any = await client.chat.completions.create({
      model: 'hf:meta-llama/Meta-Llama-3.1-405B-Instruct',
      messages: [
        { role: 'system', content: '자연스러운 한국어로 번역하여, 한국어로 대답해 줘. 최대한 "~기"로 끝내 줘.' },
        { role: 'user', content: `${response.data.option1} / ${response.data.option2}. Please translate to Korean each of the two sentences and return them to JSON with items option1 and option2. DO NOT add any descriptions. 마크다운 형태가 아닌, 순수 텍스트 형태의 오직 완벽한 JSON 형태만 반환해 줘.` }
      ],
      temperature: 0
    })
    const result = JSON.parse(completion.choices[0].message.content)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('밸런스게임')
      .setDescription('두 가지 선택지 중 하나를 골라주세요.')
      .addFields(
        { name: '1️⃣', value: result.option1 },
        { name: '2️⃣', value: result.option2 }
      )

    const one = new ButtonBuilder()
      .setCustomId('one')
      .setLabel('1️⃣')
      .setStyle(ButtonStyle.Primary)

    const two = new ButtonBuilder()
      .setCustomId('two')
      .setLabel('2️⃣')
      .setStyle(ButtonStyle.Primary)

    const row = new ActionRowBuilder<ButtonBuilder>()
      .addComponents(one, two)

    const message = await interaction.followUp({ embeds: [embed], components: [row] })

    const collector: any = message.createMessageComponentCollector({ time: 30000 })
    collector.on('collect', async (i: any) => {
      await i.deferUpdate()
      let choice
      if (i.customId === 'one') {
        await axios.get(`https://api.gamecord.xyz/wyr/vote?id=${response.data.id}&option=1`)
        choice = result.option1
      } else {
        await axios.get(`https://api.gamecord.xyz/wyr/vote?id=${response.data.id}&option=2`)
        choice = result.option2
      }

      const resultEmbed = new EmbedBuilder()
        .setColor('Green')
        .setTitle('밸런스게임 결과')
        .setDescription(`${i.user.username}님의 선택: **${choice}**`)
        .addFields(
          { name: '1️⃣', value: `${result.option1}: ${response.data.option1Votes}` },
          { name: '2️⃣', value: `${result.option2}: ${response.data.option2Votes}` }
        )

      await message.edit({ embeds: [resultEmbed], components: [] })
      collector.stop()
    })
  }
}