import { Events, type BaseInteraction } from 'discord.js'

export default {
  name: Events.InteractionCreate,

  async execute (interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return

    const command = interaction.client.commands.get(interaction.commandName)
    if (command == null) {
      return await interaction.client.error.INVALID_INTERACTION(interaction)
    }

    await interaction.deferReply()

    const banned = (await interaction.client.mysql.query(`SELECT banned FROM user WHERE id = ${interaction.user.id}`))
    if (banned.banned === undefined) {
      await interaction.client.mysql.register(interaction)
    }
    if (banned.banned === 1) {
      const reason = (await interaction.client.mysql.query(`SELECT banned_reason FROM user WHERE id = ${interaction.user.id}`))
      return await interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction, reason.banned_reason)
    }

    try {
      await command.execute(interaction)
    } catch (error: any) {
      console.log(error)
      return await interaction.client.error.UNKNOWN_ERROR(interaction, error)
    }

    console.log(`[InteractionCreate] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`)
    await interaction.client.mysql.query('UPDATE statistics SET count = count + 1 WHERE event = "total_command"')
    await interaction.client.mysql.query(`UPDATE user SET count = count + 1 WHERE id = "${interaction.user.id}"`)
  }
}
