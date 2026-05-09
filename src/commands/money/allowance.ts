import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { eq, sql } from 'drizzle-orm';
import { activities } from '@/db/schema/users.js';
import { db } from '@/db/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('allowance')
    .setNameLocalizations({
      ko: '용돈'
    })
    .setDescription('Receive an allowance. You can receive it once a day.')
    .setDescriptionLocalizations({
      ko: '용돈을 받습니다. 하루에 한 번 받을 수 있습니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const [activity] = await db.select({ lastClaim: activities.lastClaim }).from(activities).where(eq(activities.id, interaction.user.id));

    const lastClaimDate = activity?.lastClaim ?? new Date(0);
    const currentDate = new Date();

    if (lastClaimDate.getTime() + 86400000 > currentDate.getTime()) return interaction.error.allowanceOnceADay();

    const [updated] = await db
      .insert(activities)
      .values({
        id: interaction.user.id,
        money: 200000n,
        lastClaim: currentDate
      })
      .onConflictDoUpdate({
        target: activities.id,
        set: {
          money: sql`${activities.money} + 200000`,
          lastClaim: currentDate
        }
      })
      .returning({ money: activities.money });

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🏦 용돈')
      .setDescription(`200,000₩을 받았습니다.\n현재 잔액: ${(updated?.money ?? 0n).toLocaleString()}₩`);
    await interaction.editReply({ embeds: [embed] });
  }
};
