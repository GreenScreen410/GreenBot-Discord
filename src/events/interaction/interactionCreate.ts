import { type BaseInteraction, Events } from 'discord.js';
import { eq, sql } from 'drizzle-orm';
import i18next from 'i18next';
import { db } from '@/db/index.js';
import { statistics, users } from '@/db/schema/users.js';
import { createErrorHandler } from '@/handler/error.js';
import { logger } from '@/handler/logger.js';

export default {
  name: Events.InteractionCreate,

  async execute(interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() && !interaction.isModalSubmit() && !interaction.isAutocomplete()) return;

    if (interaction.isChatInputCommand()) {
      await db
        .insert(users)
        .values({ id: interaction.user.id })
        .onConflictDoUpdate({ target: users.id, set: { id: interaction.user.id } });
    }
    const [user] = await db.select({ language: users.language, banned: users.banned }).from(users).where(eq(users.id, interaction.user.id));

    const locale = user?.language ?? 'ko';
    interaction.i18n = i18next.getFixedT(locale);
    interaction.userLocale = locale;

    if (interaction.isAutocomplete()) {
      const command = interaction.client.commands.get(interaction.commandName);
      if (command?.autocomplete) await command.autocomplete(interaction);
      return;
    }

    interaction.error = createErrorHandler(interaction);

    if (interaction.isModalSubmit()) {
      const command = interaction.client.commands.get(interaction.customId);
      if (command?.modal) await command.modal(interaction);
      return;
    }

    const command = interaction.client.commands.get(interaction.commandName);
    if (command == null) {
      return interaction.error.invalidInteraction();
    }

    if (!interaction.inCachedGuild()) {
      return interaction.error.canNotUseInDm();
    }

    if (user?.banned) {
      return interaction.error.youHaveBeenBanned();
    }

    try {
      if (command.subcommands) {
        await interaction.deferReply();
        await command.subcommands[interaction.options.getSubcommand()](interaction);
      } else {
        await command.execute(interaction);
      }
    } catch (error: unknown) {
      logger.error(error);
      return interaction.error.unknownError();
    }

    await Promise.all([
      db
        .insert(statistics)
        .values({ command: 'total_command', count: 1n })
        .onConflictDoUpdate({ target: statistics.command, set: { count: sql`${statistics.count} + 1` } }),
      db
        .insert(statistics)
        .values({ command: interaction.commandName, count: 1n })
        .onConflictDoUpdate({ target: statistics.command, set: { count: sql`${statistics.count} + 1` } }),
      db
        .update(users)
        .set({ count: sql`${users.count} + 1` })
        .where(eq(users.id, interaction.user.id))
    ]);

    logger.info(
      `${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}${interaction.options.data.length > 0 ? ` (${interaction.options.data.map((option) => `${option.name}: ${option.value}`).join(', ')})` : ''}`
    );
  }
};
