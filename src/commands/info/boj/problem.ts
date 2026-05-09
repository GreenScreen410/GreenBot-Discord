import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  type ChatInputCommandInteraction,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  type SlashCommandSubcommandBuilder
} from 'discord.js';
import { tierColors, tierEmojis } from '../boj.js';

interface Problem {
  problemId: number;
  titleKo: string;
  level: number;
  acceptedUserCount: number;
  averageTries: number;
  tags: Array<{ displayNames: Array<{ name: string }> }>;
}

export const data = (subcommand: SlashCommandSubcommandBuilder) =>
  subcommand
    .setName('problem')
    .setNameLocalizations({
      ko: '문제'
    })
    .setDescription('Loads information about a Baekjoon Online Judge problem.')
    .setDescriptionLocalizations({
      ko: '백준 문제 정보를 불러옵니다.'
    })
    .addIntegerOption((option) =>
      option
        .setName('id')
        .setNameLocalizations({
          ko: '문제'
        })
        .setDescription('Enter the problem ID. If you do not enter a problem ID, a problem will be loaded randomly.')
        .setDescriptionLocalizations({
          ko: '문제 ID를 입력해 주세요. 문제 ID를 입력하지 않을 시, 랜덤으로 문제를 불러옵니다.'
        })
        .setMinValue(1000)
    );

export async function execute(interaction: ChatInputCommandInteraction) {
  const problemID = interaction.options.getInteger('id');

  let problemData: Problem;
  if (problemID) {
    const res = await fetch(`https://solved.ac/api/v3/problem/show?problemId=${problemID}`);
    if (!res.ok) return interaction.error.invalidArgument();
    problemData = await res.json();
  } else {
    problemData = (await fetch('https://solved.ac/api/v3/search/problem?query=*&sort=random&direction=asc&page=1').then((res) => res.json())).items[0];
  }

  const title = `## [${problemData.problemId} - ${problemData.titleKo}](https://www.acmicpc.net/problem/${problemData.problemId})`;
  const stats =
    `<:ac:1236283747045998675> ${interaction.i18n('command.boj.acceptedUsers')}: **${problemData.acceptedUserCount.toLocaleString()}**\n` +
    `🔁 ${interaction.i18n('command.boj.averageTries')}: **${problemData.averageTries.toLocaleString()}**`;

  const container = new ContainerBuilder()
    .addTextDisplayComponents((text) => text.setContent(title))
    .addTextDisplayComponents((text) => text.setContent(stats));

  const revealButton = new ButtonBuilder()
    .setCustomId('boj_problem_reveal')
    .setLabel(interaction.i18n('command.boj.revealButton'))
    .setStyle(ButtonStyle.Secondary);
  const row = new ActionRowBuilder<ButtonBuilder>().addComponents(revealButton);

  const reply = await interaction.editReply({
    components: [container, row],
    flags: MessageFlags.IsComponentsV2
  });

  const collector = reply.createMessageComponentCollector({ componentType: ComponentType.Button });
  collector.on('collect', async (buttonInteraction) => {
    if (buttonInteraction.customId !== 'boj_problem_reveal') return;

    const tags = problemData.tags.length > 0 ? problemData.tags.map((tag) => tag.displayNames[0].name).join('\n') : interaction.i18n('command.boj.noTags');

    const revealedTitle = `## ${tierEmojis[problemData.level]} [${problemData.problemId} - ${problemData.titleKo}](https://www.acmicpc.net/problem/${problemData.problemId})`;

    const revealedContainer = new ContainerBuilder()
      .setAccentColor(Number.parseInt(tierColors[problemData.level].replace('#', ''), 16))
      .addTextDisplayComponents((text) => text.setContent(revealedTitle))
      .addTextDisplayComponents((text) => text.setContent(stats))
      .addSeparatorComponents((separator) => separator.setDivider(true))
      .addTextDisplayComponents((text) => text.setContent(`${tags}`));

    await buttonInteraction.reply({ components: [revealedContainer], flags: MessageFlags.IsComponentsV2 | MessageFlags.Ephemeral });
  });
}
