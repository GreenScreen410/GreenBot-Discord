import { Events, type Guild } from 'discord.js'
import chalk from 'chalk'

export default {
  name: Events.GuildCreate,

  async execute (guild: Guild) {
    console.log(chalk.green.bold(`[GuildCreate] Invited to ${guild.name}(${guild.id})`))
  }
}
