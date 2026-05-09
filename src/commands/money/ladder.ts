import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { eq, sql } from 'drizzle-orm';
import { activities } from '@/db/schema/users.js';
import { db } from '@/db/index.js';

export default {
  data: new SlashCommandBuilder()
    // ... data remains same ...
    .setName('ladder')
    .setNameLocalizations({
      ko: '사다리'
    })
    .setDescription('Play ladder game with different multipliers.')
    .setDescriptionLocalizations({
      ko: '다양한 배율의 사다리 게임을 플레이합니다.'
    })
    .addIntegerOption((option) =>
      option
        .setName('money')
        .setNameLocalizations({
          ko: '금액'
        })
        .setDescription('The amount of money you want to bet.')
        .setDescriptionLocalizations({
          ko: '베팅할 금액을 입력하세요.'
        })
        .setMinValue(1)
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName('level')
        .setNameLocalizations({
          ko: '단계'
        })
        .setDescription('Choose ladder level (1-6)')
        .setDescriptionLocalizations({
          ko: '사다리 단계를 선택하세요 (1-6)'
        })
        .setMinValue(1)
        .setMaxValue(6)
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const [activity] = await db.select({ money: activities.money }).from(activities).where(eq(activities.id, interaction.user.id));

    const currentMoney = activity?.money ?? 0n;
    const betting = BigInt(interaction.options.getInteger('money', true));
    const level = interaction.options.getInteger('level', true);

    if (currentMoney < betting) {
      return interaction.error.canNotAfford();
    }

    const multipliers: Record<number, { rate: number; chance: number }> = {
      1: { rate: 0.3, chance: 0.75 },
      2: { rate: 0.5, chance: 0.7 },
      3: { rate: 0.8, chance: 0.65 },
      4: { rate: 1.3, chance: 0.45 },
      5: { rate: 2.0, chance: 0.3 },
      6: { rate: 3.0, chance: 0.2 }
    };

    const isWin = Math.random() < multipliers[level].chance;
    const reward = isWin ? BigInt(Math.floor(Number(betting) * multipliers[level].rate)) : -betting;
    const newBalance = currentMoney + reward;

    await db
      .insert(activities)
      .values({
        id: interaction.user.id,
        money: newBalance,
        winMoney: isWin ? betting : 0n,
        loseMoney: isWin ? 0n : betting
      })
      .onDuplicateKeyUpdate({
        set: {
          money: newBalance,
          winMoney: sql`${activities.winMoney} + ${isWin ? betting : 0n}`,
          loseMoney: sql`${activities.loseMoney} + ${isWin ? 0n : betting}`
        }
      });

    const ladderVisualization = Array(6)
      .fill('')
      .map((_, index) => {
        const currentLevel = 6 - index;
        if (currentLevel === level) {
          return `${currentLevel}번째 사다리에서 ${isWin ? '성공' : '실패'}! (${multipliers[currentLevel].rate}배)`;
        }
        return `${currentLevel}번째 사다리 (${multipliers[currentLevel].chance * 100}%, ${multipliers[currentLevel].rate}배)`;
      })
      .join('\n');

    const embed = new EmbedBuilder()
      .setTitle('🪜 사다리 게임 결과')
      .setDescription(ladderVisualization)
      .addFields(
        { name: '베팅 금액', value: `${betting.toLocaleString()}₩`, inline: true },
        { name: '선택한 단계', value: `${level}단계 (${multipliers[level].rate}배)`, inline: true },
        { name: '결과', value: isWin ? '✅ 성공!' : '❌ 실패...', inline: true },
        { name: '획득 금액', value: `${reward.toLocaleString()}₩`, inline: true },
        {
          name: '현재 잔액',
          value: `${newBalance.toLocaleString()}₩ (${isWin ? '+' : '-'} ${betting.toLocaleString()}₩)`,
          inline: true
        }
      )
      .setColor(isWin ? 'Green' : 'Red')
      .setFooter({ text: '높은 단계일수록 성공 확률이 낮아지지만 배율이 높아집니다!' });
    await interaction.editReply({ embeds: [embed] });
  }
};
