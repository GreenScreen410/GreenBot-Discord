import { SlashCommandBuilder } from 'discord.js';

export const tierData = {
  unranked: {
    color: '#000000',
    emoji: '<:notratable:1236286879918325811>'
  },
  bronze: {
    color: '#a95918',
    emoji: [
      '<:bronze5:1236286908229750845>',
      '<:bronze4:1236286906548097064>',
      '<:bronze3:1236286904606003210>',
      '<:bronze2:1236286902873751772>',
      '<:bronze1:1236286901225521152>'
    ]
  },
  silver: {
    color: '#455f78',
    emoji: [
      '<:silver5:1236286964576026664>',
      '<:silver4:1236286961212325949>',
      '<:silver3:1236286958582501436>',
      '<:silver2:1236286956011261952>',
      '<:silver1:1236287152040579082>'
    ]
  },
  gold: {
    color: '#e89c2b',
    emoji: [
      '<:gold5:1236286926802128896>',
      '<:gold4:1236287143463227482>',
      '<:gold3:1236286922502967358>',
      '<:gold2:1236286920284442766>',
      '<:gold1:1236287141886165043>'
    ]
  },
  platinum: {
    color: '#4ce0a7',
    emoji: [
      '<:platinum5:1236286938168950896>',
      '<:platinum4:1236287148139741285>',
      '<:platinum3:1236286933798223964>',
      '<:platinum2:1236287145682145331>',
      '<:platinum1:1236286929595535431>'
    ]
  },
  diamond: {
    color: '#2eb2f6',
    emoji: [
      '<:diamond5:1236286916257644574>',
      '<:diamond4:1236286914081067039>',
      '<:diamond3:1236286912956862534>',
      '<:diamond2:1236286911459491871>',
      '<:diamond1:1236286909836427408>'
    ]
  },
  ruby: {
    color: '#f72664',
    emoji: [
      '<:ruby5:1236286950626037791>',
      '<:ruby4:1236286947924774933>',
      '<:ruby3:1236286944913264731>',
      '<:ruby2:1236287150069125192>',
      '<:ruby1:1236286940102398002>'
    ]
  }
};

export const tierEmojis = [
  tierData.unranked.emoji,
  ...Object.values(tierData)
    .slice(1)
    .flatMap((t) => t.emoji)
];

export const tierColors = [
  tierData.unranked.color,
  ...Object.values(tierData)
    .slice(1)
    .flatMap((t) => Array(5).fill(t.color))
];

export default {
  data: new SlashCommandBuilder()
    .setName('boj')
    .setNameLocalizations({
      ko: '백준'
    })
    .setDescription('Loads information about a Baekjoon Online Judge problem.')
    .setDescriptionLocalizations({
      ko: '백준/solved.ac 정보를 불러옵니다.'
    })
};
