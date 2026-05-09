import { type ChatInputCommandInteraction, type ColorResolvable, EmbedBuilder, type SlashCommandSubcommandBuilder, time } from 'discord.js';
import { tierColors, tierEmojis } from '../boj.js';

interface User {
  handle: string;
  profileImageUrl: string;
  tier: number;
  rating: number;
  class: number;
  rank: number;
  solvedCount: number;
  voteCount: number;
  rivalCount: number;
  reverseRivalCount: number;
  stardusts: number;
  coins: number;
  proUntil: string;
  backgroundId: string;
}

export const data = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName('user')
    .setNameLocalizations({
      ko: '유저'
    })
    .setDescription('Loads information about a Baekjoon Online Judge user.')
    .setDescriptionLocalizations({
      ko: '백준 유저 정보를 불러옵니다.'
    })
    .addStringOption((option) =>
      option
        .setName('handle')
        .setNameLocalizations({
          ko: '핸들'
        })
        .setDescription('Enter the user handle.')
        .setDescriptionLocalizations({
          ko: '사용자 핸들을 입력해 주세요.'
        })
        .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
  const handle = interaction.options.getString('handle');

  const user = (await fetch(`https://solved.ac/api/v3/user/show?handle=${handle}`).then((res) => res.json())) as User;
  const background = await fetch(`https://solved.ac/api/v3/background/show?backgroundId=${user.backgroundId}`).then((res) => res.json());

  const embed = new EmbedBuilder()
    .setURL(`https://solved.ac/profile/${handle}`)
    .setThumbnail(user.profileImageUrl ?? 'https://static.solved.ac/misc/360x360/default_profile.png')
    .setColor(tierColors[user.tier] as ColorResolvable)
    .setTitle(`${tierEmojis[user.tier]} ${user.handle}`)
    .setDescription(user.rating.toLocaleString())
    .addFields(
      { name: '🔢 클래스', value: user.class.toLocaleString(), inline: true },
      { name: '🏆 순위', value: user.rank.toLocaleString(), inline: true },
      { name: '✏️ 해결한 문제', value: user.solvedCount.toLocaleString(), inline: true },
      { name: '🤝 기여한 문제', value: user.voteCount.toLocaleString(), inline: true },
      { name: '👤 라이벌', value: user.rivalCount.toLocaleString(), inline: true },
      { name: '👤 역라이벌', value: user.reverseRivalCount.toLocaleString(), inline: true },
      { name: '🌟 별조각', value: user.stardusts.toLocaleString(), inline: true },
      { name: '🪙 코인', value: (user.coins * 0.01).toLocaleString(), inline: true },
      { name: '♥️ 프로 기간', value: time(Math.floor(new Date(user.proUntil).getTime() / 1000)), inline: true }
    )
    .setImage(background.backgroundImageUrl);
  await interaction.editReply({ embeds: [embed] });
}
