import { type ChatInputCommandInteraction, Colors, EmbedBuilder, type SlashCommandSubcommandBuilder, TimestampStyles, time } from 'discord.js';
import type { QuaverQPVMUser, QuaverUser } from '@/types/quaver';

function getCountryName(code: string, locale: string, fallback: string): string {
  if (!code) return fallback;
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
  const t = interaction.i18n;
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
      qpvmUnavailableMessage = t('command.quaver.user.qpvmUnavailable');
    } else if (qpvmText.trim() !== 'null') {
      const rankData = JSON.parse(qpvmText) as QuaverQPVMUser;
      const winRate = rankData.matchesPlayed > 0 ? ((rankData.wins / rankData.matchesPlayed) * 100).toFixed(1) : '0.0';
      winRateDisplay = t('command.quaver.user.winRateValue', { rate: winRate, played: rankData.matchesPlayed, wins: rankData.wins });
      tierDisplay = `**${rankData.letterRank.toUpperCase()}** (#${rankData.rank})`;
      ratingDisplay = `**${rankData.rating.toFixed(2)}** ± ${rankData.sigma.toFixed(2)}`;
    }
  } catch {
    qpvmUnavailableMessage = t('command.quaver.user.qpvmUnavailable');
  }

  const qpvmFields = qpvmUnavailableMessage
    ? [
        { name: '​', value: t('command.quaver.user.qpvmHeader'), inline: false },
        { name: t('command.quaver.user.errorTitle'), value: qpvmUnavailableMessage, inline: false }
      ]
    : [
        { name: '​', value: t('command.quaver.user.qpvmHeader'), inline: false },
        { name: t('command.quaver.user.tier'), value: tierDisplay, inline: true },
        { name: t('command.quaver.user.tierRating'), value: ratingDisplay, inline: true },
        { name: t('command.quaver.user.winRate'), value: winRateDisplay, inline: true }
      ];

  const country = getCountryName(user.country, interaction.locale, t('command.quaver.user.unknown'));

  const embed = new EmbedBuilder()
    .setColor(Colors.Blue)
    .setTitle(t('command.quaver.user.title', { username: user.username }))
    .setURL(`https://quavergame.com/user/${user.id}`)
    .setThumbnail(user.avatar_url)
    .addFields(
      { name: t('command.quaver.user.userId'), value: user.id.toString(), inline: true },
      { name: t('command.quaver.user.globalRanking'), value: `#${s4.ranks.global.toLocaleString()}`, inline: true },
      { name: t('command.quaver.user.countryRanking', { country }), value: `#${s4.ranks.country.toLocaleString()}`, inline: true },
      { name: t('command.quaver.user.rating'), value: `${s4.overall_performance_rating.toFixed(2)}`, inline: true },
      { name: t('command.quaver.user.accuracy'), value: `${s4.overall_accuracy.toFixed(2)}%`, inline: true },
      { name: t('command.quaver.user.rankedScore'), value: s4.ranked_score.toLocaleString(), inline: true },
      { name: t('command.quaver.user.totalScore'), value: s4.total_score.toLocaleString(), inline: true },
      { name: t('command.quaver.user.playCount'), value: t('command.quaver.user.playCountValue', { count: s4.play_count.toLocaleString() }), inline: true },
      { name: t('command.quaver.user.maxCombo'), value: `${s4.max_combo.toLocaleString()}x`, inline: true },
      { name: t('command.quaver.user.failCount'), value: t('command.quaver.user.playCountValue', { count: s4.fail_count.toLocaleString() }), inline: true },
      { name: t('command.quaver.user.registeredAt'), value: time(new Date(user.time_registered), TimestampStyles.RelativeTime), inline: true },
      { name: t('command.quaver.user.latestActivity'), value: time(new Date(user.latest_activity), TimestampStyles.RelativeTime), inline: true },
      { name: t('command.quaver.user.grades'), value: grades, inline: false },
      ...qpvmFields
    );
  await interaction.editReply({ embeds: [embed] });
}
