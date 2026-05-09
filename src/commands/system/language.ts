import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { eq } from 'drizzle-orm';
import { users } from '@/db/schema/users.js';
import { db } from '@/db/index.js';

export default {
  data: new SlashCommandBuilder()
    .setName('language')
    .setNameLocalizations({
      ko: '언어'
    })
    .setDescription('Change your language.')
    .setDescriptionLocalizations({
      ko: '언어를 변경합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('language')
        .setNameLocalizations({
          ko: '언어'
        })
        .setDescription('Select a language.')
        .setDescriptionLocalizations({
          ko: '언어를 선택해 주세요.'
        })
        .addChoices({ name: '한국어', value: 'ko' })
        .addChoices({ name: 'English', value: 'en_US' })
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const [user] = await db.select({ language: users.language }).from(users).where(eq(users.id, interaction.user.id));

    const oldLanguage = user.language;
    const newLanguage = interaction.options.getString('language', true);

    await db.update(users).set({ language: newLanguage }).where(eq(users.id, interaction.user.id));

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(interaction.i18n('command.language.title'))
      .setDescription(interaction.i18n('command.language.description', { oldLanguage, newLanguage }));
    await interaction.editReply({ embeds: [embed] });
  }
};
