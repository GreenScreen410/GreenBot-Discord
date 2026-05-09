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

const badgeEmojis: Record<string, string> = {
  Staff: '👨‍💼 Discord 직원',
  Partner: '🤝 파트너',
  Hypesquad: '🏠 HypeSquad 이벤트',
  HypeSquadOnlineHouse1: '🟣 HypeSquad Bravery',
  HypeSquadOnlineHouse2: '🟠 HypeSquad Brilliance',
  HypeSquadOnlineHouse3: '🟢 HypeSquad Balance',
  BugHunterLevel1: '🐛 버그 헌터 Lv.1',
  BugHunterLevel2: '🐛 버그 헌터 Lv.2',
  PremiumEarlySupporter: '💎 초기 Nitro 서포터',
  VerifiedDeveloper: '✅ 초기 인증된 봇 개발자',
  CertifiedModerator: '🛡️ 모더레이터 프로그램 동문',
  ActiveDeveloper: '🔨 활동 중인 개발자'
};

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

    const user = await member.user.fetch();
    const avatarURL = user.displayAvatarURL({ extension: 'png', size: 4096 });
    const roles = member.roles.cache.filter((role) => role.id !== interaction.guildId).sort((a, b) => b.position - a.position);

    const container = new ContainerBuilder().setAccentColor(member.displayColor);

    // 기본 정보 + 썸네일
    const nickname = member.nickname ? ` (${member.nickname})` : '';
    const joinedAt =
      member.joinedTimestamp != null
        ? `${time(new Date(member.joinedTimestamp), TimestampStyles.LongDate)} (${time(new Date(member.joinedTimestamp), TimestampStyles.RelativeTime)})`
        : '알 수 없음';

    const lines = [
      `📛 **이름:** ${user.username}${nickname}${user.bot ? ' 🤖' : ''}`,
      `🆔 **ID:** ${user.id}`,
      `🎂 **계정 생성일:** ${time(user.createdAt, TimestampStyles.LongDate)} (${time(user.createdAt, TimestampStyles.RelativeTime)})`,
      `📅 **서버 가입일:** ${joinedAt}`
    ];
    if (member.premiumSince) {
      lines.push(`🚀 **부스트 시작일:** ${time(member.premiumSince, TimestampStyles.LongDate)} (${time(member.premiumSince, TimestampStyles.RelativeTime)})`);
    }
    const info = lines.join('\n');

    const section = new SectionBuilder()
      .addTextDisplayComponents(new TextDisplayBuilder().setContent(`## ${user.tag}`), new TextDisplayBuilder().setContent(info))
      .setThumbnailAccessory(new ThumbnailBuilder().setURL(avatarURL));

    container.addSectionComponents(section);

    // 배지
    const flags = user.flags?.toArray() ?? [];
    const badges = flags.map((flag) => badgeEmojis[flag]).filter(Boolean);
    if (badges.length > 0) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) => text.setContent(`🏅 **배지:** ${badges.join(', ')}`));
    }

    // 역할
    if (roles.size > 0) {
      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) => text.setContent(`🏷️ **역할 (${roles.size}):** ${roles.map((role) => role.toString()).join(' ')}`));
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
          `### 🤖 봇 정보\n` +
            `🖥️ **OS:** ${os.platform()} ${os.arch()} ${os.release()}\n` +
            `💾 **메모리:** ${(os.freemem() / 1024 ** 3).toFixed(2)}GB / ${(os.totalmem() / 1024 ** 3).toFixed(2)}GB\n` +
            `💻 **CPU:** ${os.cpus()[0].model}\n` +
            `📂 **Node.js:** ${process.version}\n` +
            `📦 **discord.js:** ${version}`
        )
      );
    }

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
