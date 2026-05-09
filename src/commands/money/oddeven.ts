import {
  ActionRowBuilder,
  ButtonBuilder,
  type ButtonInteraction,
  ButtonStyle,
  type ChatInputCommandInteraction,
  Colors,
  ComponentType,
  ContainerBuilder,
  MessageFlags,
  ModalBuilder,
  type ModalSubmitInteraction,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  TextInputBuilder,
  TextInputStyle
} from 'discord.js';
import { eq, sql } from 'drizzle-orm';
import { activities } from '@/db/schema/users.js';
import { db } from '@/db/index.js';

function parseBetting(value: string): bigint | null {
  const normalized = value.replaceAll(',', '').trim();
  if (!/^[0-9]+$/.test(normalized)) return null;

  try {
    return BigInt(normalized);
  } catch {
    return null;
  }
}

function resolveChoiceFromCustomId(customId: string): 'odd' | 'even' | null {
  if (customId.endsWith('_odd')) return 'odd';
  if (customId.endsWith('_even')) return 'even';

  return null;
}

function buildChoiceRow(baseId: string) {
  return new ActionRowBuilder<ButtonBuilder>().addComponents(
    new ButtonBuilder().setCustomId(`${baseId}_odd`).setLabel('홀').setStyle(ButtonStyle.Primary),
    new ButtonBuilder().setCustomId(`${baseId}_even`).setLabel('짝').setStyle(ButtonStyle.Secondary)
  );
}

function buildChoiceContainer(betting: bigint) {
  const container = new ContainerBuilder().setAccentColor(Colors.Blurple);
  container.addTextDisplayComponents(
    (text) => text.setContent('## 🎲 홀짝'),
    (text) => text.setContent(`도박할 금액: **${betting.toLocaleString()}₩**`),
    (text) => text.setContent('아래 버튼으로 홀 또는 짝을 선택하세요.')
  );
  container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
  return container;
}

function buildTimeoutContainer() {
  const container = new ContainerBuilder().setAccentColor(Colors.Grey);
  container.addTextDisplayComponents((text) => text.setContent('시간 초과로 게임이 취소되었습니다.'));
  return container;
}

export default {
  data: new SlashCommandBuilder()
    .setName('oddeven')
    .setNameLocalizations({
      ko: '홀짝'
    })
    .setDescription('Open a modal to play odd/even.')
    .setDescriptionLocalizations({
      ko: '모달에서 금액을 입력하고 버튼으로 홀/짝을 선택합니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    const modal = new ModalBuilder().setCustomId('oddeven').setTitle('홀짝');

    const moneyInput = new TextInputBuilder()
      .setCustomId('money')
      .setLabel('도박할 금액')
      .setPlaceholder('예: 10000')
      .setStyle(TextInputStyle.Short)
      .setRequired(true);

    modal.addComponents(new ActionRowBuilder<TextInputBuilder>().addComponents(moneyInput));

    await interaction.showModal(modal);
  },

  async modal(interaction: ModalSubmitInteraction) {
    return handleModalSubmit(interaction);
  }
};

function resolveGame(money: bigint, betting: bigint, userChoice: 'odd' | 'even') {
  const randomNumber = Math.floor(Math.random() * 100) + 1;
  const gameResult: 'odd' | 'even' = randomNumber % 2 === 0 ? 'even' : 'odd';
  const isWin = gameResult === userChoice;
  const reward = isWin ? betting : -betting;

  return {
    isWin,
    newBalance: money + reward,
    randomNumber,
    gameResult
  };
}

function buildResultContainer(
  interaction: ModalSubmitInteraction,
  betting: bigint,
  userChoice: 'odd' | 'even',
  newBalance: bigint,
  isWin: boolean,
  randomNumber: number,
  gameResult: 'odd' | 'even'
) {
  const container = new ContainerBuilder().setAccentColor(isWin ? Colors.Green : Colors.Red);
  container.addTextDisplayComponents(
    (text) => text.setContent(`## ${isWin ? '✅' : '❌'} ${interaction.i18n('command.oddeven.title')}`),
    (text) =>
      text.setContent(
        interaction.i18n('command.oddeven.description', {
          betting: betting.toLocaleString(),
          choice: userChoice === 'odd' ? interaction.i18n('command.oddeven.odd') : interaction.i18n('command.oddeven.even')
        })
      )
  );
  container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
  container.addTextDisplayComponents(
    (text) =>
      text.setContent(
        `**${interaction.i18n('command.oddeven.number')}** ${randomNumber} (${gameResult === 'odd' ? interaction.i18n('command.oddeven.odd') : interaction.i18n('command.oddeven.even')})`
      ),
    (text) =>
      text.setContent(
        `**${interaction.i18n('command.oddeven.result')}** ${isWin ? interaction.i18n('command.oddeven.win') : interaction.i18n('command.oddeven.lose')}`
      ),
    (text) =>
      text.setContent(`**${interaction.i18n('command.oddeven.balance')}** ${newBalance.toLocaleString()}₩ (${isWin ? '+' : '-'} ${betting.toLocaleString()}₩)`)
  );

  return container;
}

async function handleModalSubmit(interaction: ModalSubmitInteraction) {
  const betting = parseBetting(interaction.fields.getTextInputValue('money'));

  if (betting == null || betting <= 0n) {
    return interaction.error.invalidArgument();
  }

  await interaction.deferReply();

  const [activity] = await db.select({ money: activities.money }).from(activities).where(eq(activities.id, interaction.user.id));
  const money = activity?.money ?? 0n;

  if (money < betting) {
    return interaction.error.canNotAfford();
  }

  const baseId = `oddeven:${interaction.id}`;
  const choiceMessage = await interaction.followUp({
    components: [buildChoiceContainer(betting), buildChoiceRow(baseId)],
    flags: MessageFlags.IsComponentsV2
  });

  const collector = choiceMessage.createMessageComponentCollector({
    componentType: ComponentType.Button,
    time: 15000,
    filter: (buttonInteraction: ButtonInteraction) => buttonInteraction.user.id === interaction.user.id
  });

  collector.on('collect', async (buttonInteraction) => {
    const userChoice = resolveChoiceFromCustomId(buttonInteraction.customId);
    if (userChoice == null) return;

    await buttonInteraction.deferUpdate();

    const { isWin, newBalance, randomNumber, gameResult } = resolveGame(money, betting, userChoice);

    await db
      .insert(activities)
      .values({
        id: interaction.user.id,
        money: newBalance,
        winMoney: isWin ? betting : 0n,
        loseMoney: isWin ? 0n : betting
      })
      .onConflictDoUpdate({
        target: activities.id,
        set: {
          money: newBalance,
          winMoney: sql`${activities.winMoney} + ${isWin ? betting : 0n}`,
          loseMoney: sql`${activities.loseMoney} + ${isWin ? 0n : betting}`
        }
      });

    await choiceMessage.edit({
      components: [buildResultContainer(interaction, betting, userChoice, newBalance, isWin, randomNumber, gameResult)]
    });

    collector.stop('selected');
  });

  collector.on('end', async (_, reason) => {
    if (reason === 'selected') return;

    await choiceMessage.edit({ components: [buildTimeoutContainer()] }).catch(() => null);
  });
}
