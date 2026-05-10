import { type ChatInputCommandInteraction, EmbedBuilder, GuildPremiumTier, GuildVerificationLevel, SlashCommandBuilder, time } from 'discord.js';

const verificationKeys: Record<GuildVerificationLevel, string> = {
  [GuildVerificationLevel.None]: 'command.serverinfo.verification.none',
  [GuildVerificationLevel.Low]: 'command.serverinfo.verification.low',
  [GuildVerificationLevel.Medium]: 'command.serverinfo.verification.medium',
  [GuildVerificationLevel.High]: 'command.serverinfo.verification.high',
  [GuildVerificationLevel.VeryHigh]: 'command.serverinfo.verification.veryHigh'
};

const boostTierLabels: Record<GuildPremiumTier, string> = {
  [GuildPremiumTier.None]: '0',
  [GuildPremiumTier.Tier1]: '1',
  [GuildPremiumTier.Tier2]: '2',
  [GuildPremiumTier.Tier3]: '3'
};

export default {
  data: new SlashCommandBuilder()
    .setName('serverinfo')
    .setNameLocalizations({ ko: '서버정보' })
    .setDescription('Shows the current server information.')
    .setDescriptionLocalizations({ ko: '현재 서버의 정보를 보여줍니다.' }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { guild } = interaction;
    const t = interaction.i18n;
    const none = t('command.serverinfo.none');

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setThumbnail(guild.iconURL({ size: 4096 }))
      .setTitle(t('command.serverinfo.title', { name: guild.name }))
      .setImage(guild.bannerURL({ size: 4096 }))
      .addFields(
        { name: t('command.serverinfo.name'), value: guild.name, inline: true },
        { name: t('command.serverinfo.description'), value: guild.description ?? none, inline: true },
        { name: t('command.serverinfo.id'), value: guild.id, inline: true },
        { name: t('command.serverinfo.owner'), value: `<@${guild.ownerId}>`, inline: true },
        { name: t('command.serverinfo.createdAt'), value: time(guild.createdAt), inline: true },
        { name: t('command.serverinfo.memberCount'), value: t('command.serverinfo.memberCountValue', { count: guild.memberCount }), inline: true },
        { name: t('command.serverinfo.roleCount'), value: t('command.serverinfo.countSuffix', { count: guild.roles.cache.size }), inline: true },
        { name: t('command.serverinfo.channelCount'), value: t('command.serverinfo.countSuffix', { count: guild.channels.cache.size }), inline: true },
        { name: t('command.serverinfo.rulesChannel'), value: guild.rulesChannelId ? `<#${guild.rulesChannelId}>` : none, inline: true },
        { name: t('command.serverinfo.locale'), value: guild.preferredLocale, inline: true },
        { name: t('command.serverinfo.verification.label'), value: t(verificationKeys[guild.verificationLevel]), inline: true },
        { name: t('command.serverinfo.updatesChannel'), value: guild.publicUpdatesChannel ? `<#${guild.publicUpdatesChannelId}>` : none, inline: true },
        { name: t('command.serverinfo.systemChannel'), value: guild.systemChannel ? `<#${guild.systemChannelId}>` : none, inline: true },
        { name: t('command.serverinfo.afkChannel'), value: guild.afkChannel ? `<#${guild.afkChannelId}>` : none, inline: true },
        { name: t('command.serverinfo.afkTimeout'), value: t('command.serverinfo.minutes', { count: guild.afkTimeout / 60 }), inline: true },
        { name: t('command.serverinfo.boostLevel'), value: boostTierLabels[guild.premiumTier], inline: true },
        { name: t('command.serverinfo.boostCount'), value: t('command.serverinfo.countSuffix', { count: guild.premiumSubscriptionCount ?? 0 }), inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
