import { type ChatInputCommandInteraction, Colors, EmbedBuilder, type SlashCommandSubcommandBuilder, TimestampStyles, time } from 'discord.js';
import type { QuaverQPVMUser, QuaverUser } from '@/types/quaver';

function getCountryName(code: string, locale: string): string {
  if (!code) return '알 수 없음';
  return new Intl.DisplayNames([locale], { type: 'region' }).of(code.toUpperCase()) || code;
}

export const data = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName('user')
    .setNameLocalizations({
      ko: '유저'
    })
    .setDescription('Search for a Quaver user by nickname.')
    .setDescriptionLocalizations({
      ko: '닉네임으로 퀘이버 유저 정보를 검색합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('nickname')
        .setNameLocalizations({
          ko: '닉네임'
        })
        .setDescription('The nickname to search for.')
        .setRequired(true)
    );

export async function execute(interaction: ChatInputCommandInteraction<'cached'>) {
  const nickname = interaction.options.getString('nickname', true);

  const response = await fetch(`https://api.quavergame.com/v2/user/search/${encodeURIComponent(nickname)}`);
  if (!response.ok) return interaction.error.unknownError();

  let data: { users?: QuaverUser[] };
  try {
    data = (await response.json()) as { users?: QuaverUser[] };
  } catch {
    return interaction.error.unknownError();
  }
  if (!Array.isArray(data.users)) return interaction.error.unknownError();
  if (data.users.length === 0) return interaction.error.invalidArgument();

  const user = data.users[0];
  const s4 = user.stats_keys4;
  const grades = [
    `**X:** ${s4.count_grade_x}`,
    `**SS:** ${s4.count_grade_ss}`,
    `**S:** ${s4.count_grade_s}`,
    `**A:** ${s4.count_grade_a}`,
    `**B:** ${s4.count_grade_b}`,
    `**C:** ${s4.count_grade_c}`,
    `**D:** ${s4.count_grade_d}`
  ].join(' | ');

  let tierDisplay = 'Unranked';
  let ratingDisplay = '-';
  let winRateDisplay = '-';
  let qpvmUnavailableMessage: string | null = null;

  try {
    const qpvmRes = await fetch(`https://qpvmapi.icedynamix.moe/user?id=${user.id}`);
    const qpvmText = await qpvmRes.text();

    if (!qpvmRes.ok) {
      qpvmUnavailableMessage = 'QuaverPvM 랭크를 불러오지 못했습니다.';
    } else if (qpvmText.trim() !== 'null') {
      const rankData = JSON.parse(qpvmText) as QuaverQPVMUser;
      const winRate = rankData.matchesPlayed > 0 ? ((rankData.wins / rankData.matchesPlayed) * 100).toFixed(1) : '0.0';
      winRateDisplay = `${winRate}% (${rankData.matchesPlayed}전 ${rankData.wins}승)`;
      tierDisplay = `**${rankData.letterRank.toUpperCase()}** (#${rankData.rank})`;
      ratingDisplay = `**${rankData.rating.toFixed(2)}** ± ${rankData.sigma.toFixed(2)}`;
    }
  } catch {
    qpvmUnavailableMessage = 'QuaverPvM 랭크를 불러오지 못했습니다.';
  }

  const qpvmFields = qpvmUnavailableMessage
    ? [
        { name: '\u200B', value: '**[QuaverPvM (비공식 랭크)](https://qpvm.icedynamix.moe/)**', inline: false },
        { name: '⚠️ 오류', value: qpvmUnavailableMessage, inline: false }
      ]
    : [
        { name: '\u200B', value: '**[QuaverPvM (비공식 랭크)](https://qpvm.icedynamix.moe/)**', inline: false },
        { name: '🏅 티어 (Tier)', value: tierDisplay, inline: true },
        { name: '⭐ 레이팅', value: ratingDisplay, inline: true },
        { name: '📈 승률', value: winRateDisplay, inline: true }
      ];

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(`${user.username} 님의 정보 (4K)`)
    .setURL(`https://quavergame.com/user/${user.id}`)
    .setThumbnail(user.avatar_url)
    .addFields(
      { name: '🆔 유저 ID', value: user.id.toString(), inline: true },
      { name: '🌍 글로벌 랭킹', value: `#${s4.ranks.global.toLocaleString()}`, inline: true },
      { name: `🏁 국가 랭킹 (${getCountryName(user.country, interaction.locale)})`, value: `#${s4.ranks.country.toLocaleString()}`, inline: true },
      { name: '📊 레이팅', value: `${s4.overall_performance_rating.toFixed(2)}`, inline: true },
      { name: '🎯 정확도', value: `${s4.overall_accuracy.toFixed(2)}%`, inline: true },
      { name: '🏆 랭크 점수', value: s4.ranked_score.toLocaleString(), inline: true },
      { name: '💯 총 점수', value: s4.total_score.toLocaleString(), inline: true },
      { name: '🕹️ 플레이 횟수', value: `${s4.play_count.toLocaleString()}회`, inline: true },
      { name: '🔥 최대 콤보', value: `${s4.max_combo.toLocaleString()}x`, inline: true },
      { name: '☠️ 실패 횟수', value: `${s4.fail_count.toLocaleString()}회`, inline: true },
      { name: '📅 가입일', value: time(new Date(user.time_registered), TimestampStyles.RelativeTime), inline: true },
      { name: '🕒 최근 활동', value: time(new Date(user.latest_activity), TimestampStyles.RelativeTime), inline: true },
      { name: '📈 등급 분포', value: grades, inline: false },
      ...qpvmFields
    );
  await interaction.editReply({ embeds: [embed] });
}
