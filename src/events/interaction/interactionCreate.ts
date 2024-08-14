import { Events, type BaseInteraction } from 'discord.js'

export default {
  name: Events.InteractionCreate,

  async execute (interaction: BaseInteraction) {
    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return

    const command = interaction.client.commands.get(interaction.commandName)
    await interaction.deferReply()

    if (command == null) {
      return await interaction.client.error.INVALID_INTERACTION(interaction)
    }

    const [result]: any = await interaction.client.mysql.query(`SELECT banned FROM user WHERE id=${interaction.user.id}`)
    try {
      if (result[0].banned === 1) {
        return await interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction, 'Test Message, 이게 나온다면 @6r33n을 멘션해 주세요.')
      }
    } catch (error) {
      await interaction.client.mysql.query(`INSERT INTO user VALUES (${interaction.user.id}, 0)`)
    }

    await command.execute(interaction)

    console.log(`[InteractionCreate] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`)
    await interaction.client.mysql.query('UPDATE statistics SET count=count+1 WHERE event="total_command"')

    // await interaction.client.mysql.end()
  }
}
