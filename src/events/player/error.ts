import { type Client, type ChatInputCommandInteraction } from 'discord.js'
import { type GuildQueue } from 'discord-player'
import chalk from 'chalk'

export default {
  name: 'error',

  execute (queue: GuildQueue<{ client: Client, interaction: ChatInputCommandInteraction }>, error: Error) {
    console.log(chalk.red.bold(`[PLAYER_ERROR] ${error.stack}`))
    queue.metadata.client.error.UNKNOWN_ERROR(queue.metadata.interaction, error)
  }
}
