import { Events, type BaseInteraction } from 'discord.js'
import logger from '../../handler/logger.js'

export default {
  name: Events.InteractionCreate,

  async execute (interaction: BaseInteraction) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName)
      if (command == null) {
        return interaction.client.error.INVALID_INTERACTION(interaction)
      }

      if (!interaction.inCachedGuild()) {
        return interaction.client.error.CAN_NOT_USE_IN_DM(interaction)
      }

      const banned = await interaction.client.mysql.query('SELECT banned FROM user WHERE id = ?', [interaction.user.id])
      if (banned.banned === undefined) {
        await interaction.client.mysql.register(interaction)
      }
      if (banned.banned === 1) {
        const reason = await interaction.client.mysql.query('SELECT banned_reason FROM user WHERE id = ?', [interaction.user.id])
        return interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction, reason.banned_reason)
      }

      if (command.modal == null && !interaction.isModalSubmit() && command.defer !== false) {
        await interaction.deferReply()
      }

      try {
        await command.execute(interaction)
      } catch (error: any) {
        logger.error(error)
        return interaction.client.error.UNKNOWN_ERROR(interaction, error)
      }

      logger.info(`${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}${(interaction.options.data.length > 0) ? ` (${interaction.options.data.map((option) => `${option.name}: ${option.value}`).join(', ')})` : ''}`)
      await interaction.client.mysql.query('UPDATE statistics SET count = count + 1 WHERE event = "total_command"', [])
      await interaction.client.mysql.query('UPDATE user SET count = count + 1 WHERE id = ?', [interaction.user.id])

      const commandCount = await interaction.client.mysql.query('SELECT count FROM statistics WHERE event = ?', [interaction.commandName])
      if (commandCount.count === undefined) {
        await interaction.client.mysql.query('INSERT INTO statistics (event, count) VALUES (?, 1)', [interaction.commandName])
      }
      if (commandCount.count !== undefined) {
        await interaction.client.mysql.query('UPDATE statistics SET count = count + 1 WHERE event = ?', [interaction.commandName])
      }
    } else if (interaction.isModalSubmit()) {
      const command = interaction.client.commands.get(interaction.customId)
      command.modal(interaction)
    }
  }
}
