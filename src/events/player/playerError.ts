import { type Client, type ChatInputCommandInteraction } from 'discord.js'
import { GuildQueueEvent, type GuildQueue } from 'discord-player'
import chalk from 'chalk'

export default {
  name: GuildQueueEvent.PlayerError,

  async execute (queue: GuildQueue<{ client: Client, interaction: ChatInputCommandInteraction }>, error: any) {
    console.log(chalk.red.bold(`[PlayerError] ${error.stack}`))
    await queue.metadata.client.error.UNKNOWN_ERROR(queue.metadata.interaction, error)
  }
}
