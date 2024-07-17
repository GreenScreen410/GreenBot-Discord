import { type Client, type ChatInputCommandInteraction } from 'discord.js'
import { type GuildQueue, GuildQueueEvent } from 'discord-player'
import chalk from 'chalk'

export default {
  name: GuildQueueEvent.Error,

  async execute (queue: GuildQueue<{ client: Client, interaction: ChatInputCommandInteraction }>, error: any) {
    console.log(chalk.red.bold(`[Error] ${error.stack}`))
    await queue.metadata.client.error.UNKNOWN_ERROR(queue.metadata.interaction, error)
  }
}
