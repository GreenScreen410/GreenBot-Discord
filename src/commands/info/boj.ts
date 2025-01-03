import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, type ColorResolvable } from 'discord.js'
import axios from 'axios'
import { load } from 'cheerio'

interface ProblemResponse {
  problemId: number
  titleKo: string
  level: number
  acceptedUserCount: number
  averageTries: number
  tags: Array<{ displayNames: Array<{ name: string }> }>
}

const tierData = {
  unranked: { color: '#000000', emoji: '<:notratable:1236286879918325811>' },
  bronze: { color: '#a95918', emoji: ['<:bronze5:1236286908229750845>', '<:bronze4:1236286906548097064>', '<:bronze3:1236286904606003210>', '<:bronze2:1236286902873751772>', '<:bronze1:1236286901225521152>'] },
  silver: { color: '#455f78', emoji: ['<:silver5:1236286964576026664>', '<:silver4:1236286961212325949>', '<:silver3:1236286958582501436>', '<:silver2:1236286956011261952>', '<:silver1:1236287152040579082>'] },
  gold: { color: '#e89c2b', emoji: ['<:gold5:1236286926802128896>', '<:gold4:1236287143463227482>', '<:gold3:1236286922502967358>', '<:gold2:1236286920284442766>', '<:gold1:1236287141886165043>'] },
  platinum: { color: '#4ce0a7', emoji: ['<:platinum5:1236286938168950896>', '<:platinum4:1236287148139741285>', '<:platinum3:1236286933798223964>', '<:platinum2:1236287145682145331>', '<:platinum1:1236286929595535431>'] },
  diamond: { color: '#2eb2f6', emoji: ['<:diamond5:1236286916257644574>', '<:diamond4:1236286914081067039>', '<:diamond3:1236286912956862534>', '<:diamond2:1236286911459491871>', '<:diamond1:1236286909836427408>'] },
  ruby: { color: '#f72664', emoji: ['<:ruby5:1236286950626037791>', '<:ruby4:1236286947924774933>', '<:ruby3:1236286944913264731>', '<:ruby2:1236287150069125192>', '<:ruby1:1236286940102398002>'] }
}

const tier = [tierData.unranked.emoji, ...Object.values(tierData).slice(1).flatMap(t => t.emoji)]
const tierColor = [tierData.unranked.color, ...Object.values(tierData).slice(1).flatMap(t => Array(5).fill(t.color))]

export default {
  data: new SlashCommandBuilder()
    .setName('boj')
    .setNameLocalizations({
      ko: '백준'
    })
    .setDescription('Loads information about a Baekjoon Online Judge problem.')
    .setDescriptionLocalizations({
      ko: '백준 문제 정보를 불러옵니다.'
    })
    .addIntegerOption((option) => option
      .setName('id')
      .setNameLocalizations({
        ko: '문제'
      })
      .setDescription('Enter the problem ID.')
      .setDescriptionLocalizations({
        ko: '문제 ID를 입력해 주세요.'
      })
      .setMinValue(1000)
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const problemID = interaction.options.getInteger('id', true)

    const maxProblemResponse = await axios.get('https://www.acmicpc.net/problem/added', { headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/129.0.0.0 Safari/537.36 Edg/129.0.0.0' } })
    const $ = load(maxProblemResponse.data as string)
    const maxProblemID = Number($('#problemset > tbody > tr:nth-child(1) > td.list_problem_id').text())
    if (problemID > maxProblemID) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, `${maxProblemID}번 문제까지만 조회하실 수 있습니다.`)
    }

    const { data: response } = await axios.get<ProblemResponse>(`https://solved.ac/api/v3/problem/show?problemId=${problemID}`)

    const embed = new EmbedBuilder()
      .setURL(`https://www.acmicpc.net/problem/${problemID}`)
      .setColor(tierColor[response.level] as ColorResolvable)
      .setTitle(`${response.problemId} - ${response.titleKo}`)
      .setDescription(`난이도: ${tier[response.level]}`)
      .addFields(
        { name: '<:ac:1236283747045998675> 맞은 사람', value: `${response.acceptedUserCount}`, inline: true },
        { name: '🔁 평균 시도 횟수', value: `${response.averageTries}`, inline: true }
      )

    if (response.tags.length > 0) {
      const tags = response.tags.map((tag: { displayNames: Array<{ name: string }> }) => tag.displayNames[0].name).join('\n')
      embed.addFields({ name: '📛 알고리즘 분류', value: tags })
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
