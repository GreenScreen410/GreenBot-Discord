import dayjs from 'dayjs';
import { type ChatInputCommandInteraction, Colors, EmbedBuilder, TimestampStyles, time } from 'discord.js';
import country from '../../country.json' with { type: 'json' };
import type { QuaverQPVMUser, QuaverUser } from '../../types/quaver';

function getCountryName(code: string): string {
  if (!code) return '알 수 없음';
  const lowerCode = code.toLowerCase();
  const name = (country as Record<string, string>)[lowerCode];
  return name || code;
}

export async function subcommand(interaction: ChatInputCommandInteraction<'cached'>, user: QuaverUser) {
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

  let rankData: QuaverQPVMUser | null = null;
  let tierDisplay = 'Unranked';
  let ratingDisplay = '-';
  let winRateDisplay = '-';

  const qpvmRes = await fetch(`https://qpvmapi.icedynamix.moe/user?id=${user.id}`);
  const qpvmText = await qpvmRes.text();
  if (qpvmText !== 'null') {
    rankData = JSON.parse(qpvmText) as QuaverQPVMUser;
    const winRate = rankData.matchesPlayed > 0 ? ((rankData.wins / rankData.matchesPlayed) * 100).toFixed(1) : '0.0';
    winRateDisplay = `${winRate}% (${rankData.matchesPlayed}전 ${rankData.wins}승)`;
    tierDisplay = `**${rankData.letterRank.toUpperCase()}** (#${rankData.rank})`;
    ratingDisplay = `**${rankData.rating.toFixed(2)}** ± ${rankData.sigma.toFixed(2)}`;
  }

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(`${user.username} 님의 정보 (4K)`)
    .setURL(`https://quavergame.com/user/${user.id}`)
    .setThumbnail(user.avatar_url)
    .addFields(
      { name: '🆔 유저 ID', value: user.id.toString(), inline: true },
      { name: '🌍 글로벌 랭킹', value: `#${s4.ranks.global.toLocaleString()}`, inline: true },
      { name: `🏁 국가 랭킹 (${getCountryName(user.country)})`, value: `#${s4.ranks.country.toLocaleString()}`, inline: true },
      { name: '📊 레이팅', value: `${s4.overall_performance_rating.toFixed(2)}`, inline: true },
      { name: '🎯 정확도', value: `${s4.overall_accuracy.toFixed(2)}%`, inline: true },
      { name: '🏆 랭크 점수', value: s4.ranked_score.toLocaleString(), inline: true },
      { name: '💯 총 점수', value: s4.total_score.toLocaleString(), inline: true },
      { name: '🕹️ 플레이 횟수', value: `${s4.play_count.toLocaleString()}회`, inline: true },
      { name: '🔥 최대 콤보', value: `${s4.max_combo.toLocaleString()}x`, inline: true },
      { name: '☠️ 실패 횟수', value: `${s4.fail_count.toLocaleString()}회`, inline: true },
      { name: '📅 가입일', value: time(dayjs(user.time_registered).toDate(), TimestampStyles.RelativeTime), inline: true },
      { name: '🕒 최근 활동', value: time(dayjs(user.latest_activity).toDate(), TimestampStyles.RelativeTime), inline: true },
      { name: '📈 등급 분포', value: grades, inline: false },
      { name: '\u200B', value: '**[QuaverPvM (비공식 랭크)](https://qpvm.icedynamix.moe/)**', inline: false },
      { name: '🏅 티어 (Tier)', value: tierDisplay, inline: true },
      { name: '⭐ 레이팅', value: ratingDisplay, inline: true },
      { name: '📈 승률', value: winRateDisplay, inline: true }
    );

  await interaction.editReply({ embeds: [embed] });
}
