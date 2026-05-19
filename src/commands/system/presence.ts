import { ActivityType, type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, type PresenceStatusData, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('presence')
    .setNameLocalizations({
      ko: '프리센스'
    })
    .setDescription('[Admin Only] Change the bot presence.')
    .setDescriptionLocalizations({
      ko: '[관리자] 봇의 프리센스를 변경합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('status')
        .setNameLocalizations({
          ko: '상태'
        })
        .setDescription('Online status of the bot.')
        .setDescriptionLocalizations({
          ko: '봇의 온라인 상태를 선택합니다.'
        })
        .addChoices(
          { name: 'Online', name_localizations: { ko: '온라인' }, value: 'online' },
          { name: 'Idle', name_localizations: { ko: '자리비움' }, value: 'idle' },
          { name: 'Do Not Disturb', name_localizations: { ko: '다른 용무 중' }, value: 'dnd' },
          { name: 'Invisible', name_localizations: { ko: '오프라인' }, value: 'invisible' }
        )
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('activity_type')
        .setNameLocalizations({
          ko: '활동유형'
        })
        .setDescription('Type of activity to display. Omit both activity fields to clear the activity.')
        .setDescriptionLocalizations({
          ko: '표시할 활동 유형. 두 활동 옵션 모두 비워두면 활동이 제거됩니다.'
        })
        .addChoices(
          { name: 'Playing', name_localizations: { ko: '플레이 중' }, value: ActivityType.Playing },
          { name: 'Listening', name_localizations: { ko: '듣는 중' }, value: ActivityType.Listening },
          { name: 'Watching', name_localizations: { ko: '시청 중' }, value: ActivityType.Watching },
          { name: 'Competing', name_localizations: { ko: '경쟁 중' }, value: ActivityType.Competing }
        )
    )
    .addStringOption((option) =>
      option
        .setName('activity_text')
        .setNameLocalizations({
          ko: '활동내용'
        })
        .setDescription('Text shown next to the activity type.')
        .setDescriptionLocalizations({
          ko: '활동 유형 옆에 표시될 내용입니다.'
        })
        .setMaxLength(128)
    )
    .setDefaultMemberPermissions('0'),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();

    if (interaction.user.id !== process.env.ADMIN) return interaction.error.noPermission();

    const status = interaction.options.getString('status', true) as PresenceStatusData;
    const activityType = interaction.options.getInteger('activity_type');
    const activityText = interaction.options.getString('activity_text');

    if ((activityType === null) !== (activityText === null)) return interaction.error.invalidArgument();

    const hasActivity = activityType !== null && activityText !== null;
    await interaction.client.shard?.broadcastEval(
      (c, ctx) => {
        c.user?.setPresence({
          status: ctx.status,
          activities: ctx.hasActivity ? [{ type: ctx.activityType, name: ctx.activityText }] : []
        });
      },
      {
        context: {
          status,
          hasActivity,
          activityType: activityType ?? 0,
          activityText: activityText ?? ''
        }
      }
    );

    const statusLabels: Record<PresenceStatusData, string> = {
      online: '🟢 온라인',
      idle: '🟡 자리비움',
      dnd: '🔴 다른 용무 중',
      invisible: '⚫ 오프라인'
    };
    const activityLabels: Record<number, string> = {
      [ActivityType.Playing]: '🎮 플레이 중',
      [ActivityType.Listening]: '🎧 듣는 중',
      [ActivityType.Watching]: '👀 시청 중',
      [ActivityType.Competing]: '🏆 경쟁 중'
    };
    const activityLabel = hasActivity ? `${activityLabels[activityType]} **${activityText}**` : '없음';

    const container = new ContainerBuilder()
      .addTextDisplayComponents((text) => text.setContent('## ✅ 프리센스가 변경되었습니다.'))
      .addTextDisplayComponents((text) => text.setContent(`상태: ${statusLabels[status]}\n활동: ${activityLabel}`));

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
