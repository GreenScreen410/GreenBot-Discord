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

    try {
      const banned = (await interaction.client.mysql.query(`SELECT banned FROM user WHERE id = ${interaction.user.id}`)).banned
      if (banned === 1) {
        const reason: string = (await interaction.client.mysql.query(`SELECT banned_reason FROM user WHERE id = ${interaction.user.id}`)).banned_reason
        return await interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction, reason)
      }
    } catch (error) {
      await interaction.client.mysql.register(interaction)
    }

    await command.execute(interaction)

    console.log(`[InteractionCreate] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`)
    await interaction.client.mysql.query('UPDATE statistics SET count = count + 1 WHERE event = "total_command"')
    await interaction.client.mysql.query(`UPDATE user SET count = count + 1 WHERE id = "${interaction.user.id}"`)
  }
}
