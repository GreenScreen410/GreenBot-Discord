import { type ChatInputCommandInteraction, EmbedBuilder, GuildPremiumTier, GuildVerificationLevel, SlashCommandBuilder, time } from 'discord.js';

const verificationLevels: Record<GuildVerificationLevel, string> = {
  [GuildVerificationLevel.None]: '🟢 없음',
  [GuildVerificationLevel.Low]: '🟡 낮음 (이메일 인증)',
  [GuildVerificationLevel.Medium]: '🟠 중간 (가입 5분 대기)',
  [GuildVerificationLevel.High]: '🔴 높음 (가입 10분 대기)',
  [GuildVerificationLevel.VeryHigh]: '🟣 매우 높음 (핸드폰 인증)'
};

const boostTiers: Record<GuildPremiumTier, string> = {
  [GuildPremiumTier.None]: '0레벨',
  [GuildPremiumTier.Tier1]: '1레벨',
  [GuildPremiumTier.Tier2]: '2레벨',
  [GuildPremiumTier.Tier3]: '3레벨'
};

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setNameLocalizations({ ko: '서버정보' })
    .setDescription('Shows the current server information.')
    .setDescriptionLocalizations({ ko: '현재 서버의 정보를 보여줍니다.' }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { guild } = interaction;

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setThumbnail(guild.iconURL({ size: 4096 }))
      .setTitle(`'${guild.name}' 정보`)
      .setImage(guild.bannerURL({ size: 4096 }))
      .addFields(
        { name: '📛 이름', value: guild.name, inline: true },
        { name: '📝 서버 설명', value: guild.description ?? '없음', inline: true },
        { name: '🆔 서버 ID', value: guild.id, inline: true },
        { name: '👑 서버 소유자', value: `<@${guild.ownerId}>`, inline: true },
        { name: '🎂 서버 생성일', value: time(guild.createdAt), inline: true },
        { name: '👤 유저 수', value: `${guild.memberCount}명`, inline: true },
        { name: '🎭 역할 수', value: `${guild.roles.cache.size}개`, inline: true },
        { name: '📺 채널 수', value: `${guild.channels.cache.size}개`, inline: true },
        { name: '🕮 규칙 채널', value: guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : '없음', inline: true },
        { name: '🌐 서버 지역', value: guild.preferredLocale, inline: true },
        { name: '🔒 보안 수준', value: verificationLevels[guild.verificationLevel], inline: true },
        { name: '📢 업데이트 채널', value: guild.publicUpdatesChannel ? `<#${guild.publicUpdatesChannelId}>` : '없음', inline: true },
        { name: '⚙️ 시스템 채널', value: guild.systemChannel ? `<#${guild.systemChannelId}>` : '없음', inline: true },
        { name: '💤 AFK 채널', value: guild.afkChannel ? `<#${guild.afkChannelId}>` : '없음', inline: true },
        { name: '⏰ AFK 시간', value: `${guild.afkTimeout / 60}분`, inline: true },
        { name: '✨ 부스트 레벨', value: boostTiers[guild.premiumTier], inline: true },
        { name: '🌟 부스트 수', value: `${guild.premiumSubscriptionCount ?? 0}개`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
