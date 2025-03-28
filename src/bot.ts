import { Client, GatewayIntentBits, Collection, type ApplicationCommandDataResolvable } from 'discord.js'
import { type VoicePacket, type LavalinkManager, type VoiceServer, type ChannelDeletePacket, type VoiceState } from 'lavalink-client'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import logger from './handler/logger.js'
import { translate } from './handler/i18n.js'
import ErrorHandler from './handler/error.js'
import MySQLHandler from './handler/mysql.js'
import 'dotenv/config'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>
    error: typeof ErrorHandler
    mysql: typeof MySQLHandler
    lavalink: LavalinkManager
    locale: (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) => Promise<string>
    logger: typeof logger
  }
}

const client = new Client({
  shards: 'auto',
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
})

client.commands = new Collection()
client.logger = logger
client.error = ErrorHandler
client.mysql = MySQLHandler
client.lavalink = (await import('./handler/lavalink.js')).default(client)

Client.prototype.locale = async function (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) {
  const locale = await client.mysql.query('SELECT language FROM user WHERE id = ?', [interaction.user.id])
  if (locale.language == null) {
    return translate(interaction.locale, key, ...args)
  } else {
    return translate(locale.language as string, key, ...args)
  }
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
      client.on(event.name, (...args: any[]) =>
        event.execute(...args).catch(async (error: any) => {
          logger.error(error)
          await client.users.cache.get(process.env.ADMIN_ID)!.send(`${error.stack}`)
        })
      )
    }
  }
}

client.on('raw', (d) => {
  void client.lavalink.sendRawData(d as VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket)
})

client.on('ready', () => {
  void (async () => {
    await client.lavalink.init({ ...client.user!, username: 'GreenBot' })
    await client.guilds.cache.get('825741743235268639')?.commands.set(commands as ApplicationCommandDataResolvable[])
    await client.application?.commands.set(commands as ApplicationCommandDataResolvable[])
  })()
})

await client.login(process.env.BETA_TOKEN)

process.on('SIGINT', () => {
  void (async () => {
    client.logger.info('Disconnecting from Discord...\n')
    await client.destroy()
    client.logger.info('Successfully disconnected from Discord!\n')
    process.exit()
  })()
})
