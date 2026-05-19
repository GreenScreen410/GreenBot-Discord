import os from 'node:os';
import {
  type ChatInputCommandInteraction,
  ContainerBuilder,
  MediaGalleryBuilder,
  MediaGalleryItemBuilder,
  MessageFlags,
  SectionBuilder,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextDisplayBuilder,
  ThumbnailBuilder,
  TimestampStyles,
  time,
  version
} from 'discord.js';

const knownFlags = new Set([
  'Staff',
  'Partner',
  'Hypesquad',
  'HypeSquadOnlineHouse1',
  'HypeSquadOnlineHouse2',
  'HypeSquadOnlineHouse3',
  'BugHunterLevel1',
  'BugHunterLevel2',
  'PremiumEarlySupporter',
  'VerifiedDeveloper',
  'CertifiedModerator',
  'ActiveDeveloper'
]);

export default {
  data: new SlashCommandBuilder()
    .setName('userinfo')
    .setNameLocalizations({
      ko: '유저정보'
    })
    .setDescription('Shows the information of the user.')
    .setDescriptionLocalizations({
      ko: '해당 유저의 정보를 보여줍니다. 그린Bot의 정보를 요청할 경우 특별한 정보가 추가됩니다.'
    })
    .addUserOption((option) =>
      option
        .setName('user')
        .setNameLocalizations({
          ko: '유저'
        })
        .setDescription('Select the user to check the information.')
        .setDescriptionLocalizations({
          ko: '정보를 확인할 유저를 선택해 주세요.'
        })
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();
    const member = interaction.options.getMember('user');
    if (member == null) return;

    const t = interaction.i18n;
    const user = await member.user.fetch();
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 4096 });
    const roles = member.roles.cache.filter((role) => role.id !== interaction.guildId).sort((a, b) => b.position - a.position);

    const container = new ContainerBuilder().setAccentColor(member.displayColor);

    // 기본 정보 + 썸네일
    const nickname = member.nickname ? ` (${member.nickname})` : '';
    const joinedAt =
      member.joinedTimestamp != null
        ? `${time(new Date(member.joinedTimestamp), TimestampStyles.LongDate)} (${time(new Date(member.joinedTimestamp), TimestampStyles.RelativeTime)})`
        : t('command.userinfo.unknown');

    const lines = [
      `${t('command.userinfo.name')}:** ${user.username}${nickname}${user.bot ? ' 🤖' : ''}`,
      `${t('command.userinfo.id')}:** ${user.id}`,
      `${t('command.userinfo.createdAt')}:** ${time(user.createdAt, TimestampStyles.LongDate)} (${time(user.createdAt, TimestampStyles.RelativeTime)})`,
      `${t('command.userinfo.joinedAt')}:** ${joinedAt}`
    ].map((s) => `**${s}`);
    if (member.premiumSince) {
      lines.push(
        `**${t('command.userinfo.premiumSince')}:** ${time(member.premiumSince, TimestampStyles.LongDate)} (${time(member.premiumSince, TimestampStyles.RelativeTime)})`
      );
    }
    const info = lines.join('\n');

    const section = new SectionBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${user.tag}`), new TextDisplayBuilder().setContent(info))
      .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatarURL));

    container.addSectionComponents(section);

    // 배지
    const flags = user.flags?.toArray() ?? [];
    const badges = flags.filter((f) => knownFlags.has(f)).map((f) => t(`command.userinfo.flags.${f}`));
    if (badges.length > 0) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) => text.setContent(`**${t('command.userinfo.badges')}:** ${badges.join(', ')}`));
    }

    // 역할
    if (roles.size > 0) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) =>
        text.setContent(`**${t('command.userinfo.roles', { count: roles.size })}:** ${roles.map((role) => role.toString()).join(' ')}`)
      );
    }

    // 배너
    const bannerURL = user.bannerURL({ extension: 'png', size: 4096 });
    if (bannerURL) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addMediaGalleryComponents(new MediaGalleryBuilder().addItems(new MediaGalleryItemBuilder().setURL(bannerURL)));
    }

    // 봇 정보
    if (user.id === process.env.BOT_ID) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) =>
        text.setContent(
          `### ${t('command.userinfo.botInfo')}\n` +
            `**${t('command.userinfo.botOs')}:** ${os.platform()} ${os.arch()} ${os.release()}\n` +
            `**${t('command.userinfo.botMemory')}:** ${(process.memoryUsage().rss / 1024 ** 3).toFixed(2)}GB / ${(os.totalmem() / 1024 ** 3).toFixed(2)}GB\n` +
            `💻 **CPU:** ${os.cpus()[0].model}\n` +
            `📂 **Node.js:** ${process.version}\n` +
            `📦 **discord.js:** ${version}`
        )
      );
    }

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
