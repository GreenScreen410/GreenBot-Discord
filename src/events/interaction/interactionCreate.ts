import { Events, type BaseInteraction } from 'discord.js'
import mysql from 'mysql2/promise'
import chalk from 'chalk'

export default {
  name: Events.InteractionCreate,

  async execute (interaction: BaseInteraction) {
    const connection = await mysql.createConnection({
      host: process.env.MYSQL_HOST,
      user: 'ubuntu',
      password: process.env.MYSQL_PASSWORD,
      database: process.env.MYSQL_DATABASE
    })

    if (!interaction.isChatInputCommand() || !interaction.inCachedGuild()) return

    const command = interaction.client.commands.get(interaction.commandName)
    await interaction.deferReply()

    if (command == null) {
      await interaction.client.error.INVALID_INTERACTION(interaction)
      return
    }

    const [result]: any = await connection.query(`SELECT * FROM user WHERE id=${interaction.user.id}`)
    if (result[0] == null || result[0].banned === 0) {
      await command.execute(interaction)

      const today = new Date()
      const year = today.getFullYear()
      const month = ('0' + (today.getMonth() + 1)).slice(-2)
      const day = ('0' + today.getDate()).slice(-2)
      const dateString = year + '-' + month + '-' + day
      const hours = ('0' + today.getHours()).slice(-2)
      const minutes = ('0' + today.getMinutes()).slice(-2)
      const seconds = ('0' + today.getSeconds()).slice(-2)
      const timeString = hours + ':' + minutes + ':' + seconds

      console.log(chalk.white(`${dateString} ${timeString} - [COMMAND] ${interaction.guild.name}(${interaction.guild.id}): ${interaction.user.tag}(${interaction.user.id}) executed ${interaction.commandName}`))
    } else if (result[0].banned === 1) {
      await interaction.client.error.YOU_HAVE_BEEN_BANNED(interaction, 'Test Message, 이게 나온다면 @6r33n을 멘션해 주세요.')
    }

    await connection.end()
  }
}
