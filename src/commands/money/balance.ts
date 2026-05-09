import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { eq } from 'drizzle-orm';
import { activities } from '@/db/schema/users.js';
import { db } from '@/db/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('balance')
    .setNameLocalizations({
      ko: '잔액'
    })
    .setDescription('Check the current balance.')
    .setDescriptionLocalizations({
      ko: '현재 잔액을 확인합니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    const [activity] = await db
      .select({ money: activities.money, winMoney: activities.winMoney, loseMoney: activities.loseMoney })
      .from(activities)
      .where(eq(activities.id, interaction.user.id));

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('💰 잔액')
      .setDescription(`현재 잔액: ${(activity?.money ?? 0n).toLocaleString()}₩`)
      .addFields(
        { name: '💰 얻은 돈', value: `${(activity?.winMoney ?? 0n).toLocaleString()}₩`, inline: true },
        { name: '💸 잃은 돈', value: `${(activity?.loseMoney ?? 0n).toLocaleString()}₩`, inline: true }
      );
    await interaction.reply({ embeds: [embed] });
  }
};
