import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('서버정보')
    .setDescription('현재 서버의 정보를 보여줍니다.'),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const roles = interaction.guild.roles.cache.sort((a, b) => b.position - a.position).map((role) => role.toString());
    const channels = interaction.guild.channels.cache.map((channel) => channel.toString());

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setThumbnail(`${interaction.guild.iconURL()}`)
      .setTitle(`'${interaction.guild.name}' 정보`)
      .addFields(
        { name: '📛 이름', value: interaction.guild.name, inline: true },
        { name: '📝 서버 설명', value: `${interaction.guild.description || '없음'}`, inline: true },
        { name: '🆔 ID', value: interaction.guild.id, inline: true },
        { name: '👑 서버 소유자', value: `<@${interaction.guild.ownerId}>`, inline: true },
        { name: '🎂 서버 생성일', value: `${interaction.guild.createdAt}`, inline: true },
        { name: '👤 유저 수', value: `${interaction.guild.memberCount}명`, inline: true },
        { name: '🎭 역할 및 권한', value: `${roles.length}개`, inline: true },
        { name: '📺 채널', value: `${channels.length}개`, inline: true },
        { name: '📜 서버 규칙', value: `${interaction.guild.rulesChannel || '없음'}`, inline: true },
        { name: '🕮 서버 규칙 채널', value: `${interaction.guild.rulesChannelId || '없음'}`, inline: true },
        { name: '🌐 서버 지역', value: `${interaction.guild.preferredLocale}`, inline: true },
        { name: '🔒 서버 보안 수준', value: `${interaction.guild.verificationLevel}`, inline: true },
        { name: '📢 업데이트 채널', value: `${interaction.guild.publicUpdatesChannel || '없음'}`, inline: true },
        { name: '⚙️ 시스템 채널', value: `${interaction.guild.systemChannel || '없음'}`, inline: true },
        { name: '💤 AFK 채널', value: `${interaction.guild.afkChannel || '없음'}`, inline: true },
        { name: '⏰ AFK 시간', value: `${interaction.guild.afkTimeout / 60}분`, inline: true },
        { name: '🔄 AFK 이동', value: `${interaction.guild.afkChannelId ? 'O' : 'X'}`, inline: true },
        { name: '🖼️ 서버 아이콘', value: `${interaction.guild.iconURL() || '없음'}`, inline: true },
        { name: '🚩 서버 배너', value: `${interaction.guild.bannerURL() || '없음'}`, inline: true },
        { name: '🎨 서버 배경', value: `${interaction.guild.splashURL() || '없음'}`, inline: true },
        { name: '✨ 서버 부스트 레벨', value: `${interaction.guild.premiumTier}`, inline: true },
        { name: '🌟 서버 부스트 수', value: `${interaction.guild.premiumSubscriptionCount}`, inline: true },
      )
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() });

    interaction.followUp({ embeds: [embed] });
  },
};
