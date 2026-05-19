import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SeparatorSpacingSize, SlashCommandBuilder, TimestampStyles, time } from 'discord.js';
import { count, desc, eq } from 'drizzle-orm';
import { db } from '@/db/index.js';
import { statistics, users } from '@/db/schema/users.js';

export default {
  data: new SlashCommandBuilder()
    .setName('status')
    .setNameLocalizations({
      ko: '상태'
    })
    .setDescription('Shows the bot status.')
    .setDescriptionLocalizations({
      ko: '봇의 상태를 보여줍니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();
    const { client } = interaction;
    const startedAt = new Date(Date.now() - process.uptime() * 1000);

    const [guildSizes, memberSizes, channelSizes, musicSizes, uniqueUsers, bannedUsers, totalExecutions, topUsers] = await Promise.all([
      client.shard?.fetchClientValues('guilds.cache.size') as Promise<number[]>,
      client.shard?.broadcastEval((c) => c.guilds.cache.reduce((acc, g) => acc + g.memberCount, 0)) as Promise<number[]>,
      client.shard?.fetchClientValues('channels.cache.size') as Promise<number[]>,
      client.shard?.broadcastEval((c) => c.lavalink.players.size) as Promise<number[]>,
      db.select({ value: count() }).from(users),
      db.select({ value: count() }).from(users).where(eq(users.banned, true)),
      db.select({ value: statistics.count }).from(statistics).where(eq(statistics.command, 'total_command')),
      db.select({ id: users.id, count: users.count }).from(users).orderBy(desc(users.count)).limit(1)
    ]);

    const totalGuilds = guildSizes.reduce((a, b) => a + b, 0);
    const totalMembers = memberSizes.reduce((a, b) => a + b, 0);
    const totalChannels = channelSizes.reduce((a, b) => a + b, 0);
    const totalMusicPlayers = musicSizes.reduce((a, b) => a + b, 0);

    const topUser = topUsers[0];
    const topUserDisplay = topUser
      ? await client.users
          .fetch(topUser.id)
          .then((u) => `${u.globalName ?? u.username} (${u.username}): **${(topUser.count ?? 0n).toLocaleString()}**`)
          .catch(() => `<@${topUser.id}>: **${(topUser.count ?? 0n).toLocaleString()}**`)
      : '-';

    const t = interaction.i18n;
    const fields = [
      `⏱️ **${t('command.status.uptime')}:** ${time(startedAt, TimestampStyles.RelativeTime)}`,
      `🕒 **${t('command.status.startedAt')}:** ${time(startedAt)}`,
      `📊 **${t('command.status.server')}:** ${totalGuilds.toLocaleString()}`,
      `👥 **${t('command.status.user')}:** ${totalMembers.toLocaleString()}`,
      `🪪 **${t('command.status.unique_user')}:** ${uniqueUsers[0].value.toLocaleString()}`,
      `🚫 **${t('command.status.banned')}:** ${bannedUsers[0].value.toLocaleString()}`,
      `📜 **${t('command.status.channel')}:** ${totalChannels.toLocaleString()}`,
      `🔧 **${t('command.status.command')}:** ${client.commands.size.toLocaleString()}`,
      `⚡ **${t('command.status.execute')}:** ${(totalExecutions[0]?.value ?? 0n).toLocaleString()}`,
      `🎵 **${t('command.status.music')}:** ${totalMusicPlayers.toLocaleString()}`
    ].join('\n');

    const container = new ContainerBuilder()
      .addTextDisplayComponents((text) => text.setContent(`## 📊 ${t('command.status.title')}`))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents((text) => text.setContent(fields))
      .addSeparatorComponents((sep) => sep.setSpacing(SeparatorSpacingSize.Small).setDivider(true))
      .addTextDisplayComponents((text) => text.setContent(`🏆 **${t('command.status.most_command_user')}:** ${topUserDisplay}`));

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
