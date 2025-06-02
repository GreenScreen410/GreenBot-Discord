import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import { translate } from './handler/i18n.js'
import ErrorHandler from './handler/error.js'
import MySQLHandler from './handler/mysql.js'
import { PrismaClient } from '@prisma/client'
import { type VoicePacket, type VoiceServer, type VoiceState, type ChannelDeletePacket } from 'lavalink-client/dist/types/index.js'
import 'dotenv/config'

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
})
client.commands = new Collection()
client.error = ErrorHandler
client.mysql = MySQLHandler
client.prisma = new PrismaClient()
client.lavalink = (await import('./handler/lavalink.js')).default(client)

Client.prototype.i18n = async function (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) {
  const user = await client.prisma.user.findUnique({
    where: { id: interaction.user.id },
    select: { language: true }
  })
  if (user.language == null) return translate(interaction.locale, key, ...args)
  else return translate(user.language as string, key, ...args)
}

const commands: any = []
const commandFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './commands'))
for (const folders of commandFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./commands/${folders}`))
  for (const file of folder) {
    const command = (await import(`./commands/${folders}/${file}`)).default
    client.commands.set(command.data.name as string, command)
    commands.push(command.data.toJSON())
  }
}

const eventFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './events'))
for (const folders of eventFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./events/${folders}`))
  for (const file of folder) {
    const event = (await import(`./events/${folders}/${file}`)).default
    if (folders === 'client' || folders === 'interaction') {
      if (event.once === true) {
        client.once(event.name, (...args: any[]) => event.execute(...args))
      } else {
        client.on(event.name, (...args: any[]) => event.execute(...args))
      }
    } else if (folders === 'lavalink') {
      client.lavalink.on(event.name, (...args: any[]) => event.execute(...args))
    }
  }
}

client.on('raw', (d) => {
  void client.lavalink.sendRawData(d as VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket)
})

await client.login(process.env.BETA_TOKEN)
