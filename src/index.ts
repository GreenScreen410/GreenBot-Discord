import 'dotenv/config.js'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { LavalinkManager } from 'lavalink-client'
import { readdir } from 'fs/promises'
import { join, dirname } from 'path'
import { fileURLToPath } from 'url'
import logger from './handler/logger.js'
import { translate } from './handler/i18n.js'
import { cli } from 'winston/lib/winston/config/index.js'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>
    error: typeof import('./handler/error.js').default
    mysql: typeof import('./handler/mysql.js').default
    lavalink: LavalinkManager
    locale: (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) => Promise<string>
    logger: typeof import('./handler/logger.js').default
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
}) as Client & { lavalink: LavalinkManager }
client.commands = new Collection()
client.logger = logger
client.error = (await import('./handler/error.js')).default
client.mysql = (await import('./handler/mysql.js')).default
client.lavalink = new LavalinkManager({
  nodes: [{ id: 'Local Node', host: `${process.env.SERVER_IP}`, port: 2333, authorization: `${process.env.LAVALINK_PASSWORD}`, retryAmount: 5, retryDelay: 60000, secure: false }],
  sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
  // everything down below is optional
  autoSkip: true,
  playerOptions: {
    clientBasedPositionUpdateInterval: 150,
    defaultSearchPlatform: 'ytsearch',
    volumeDecrementer: 0.75,
    // requesterTransformer: requesterTransformer,
    onDisconnect: {
      autoReconnect: true,
      destroyPlayer: false
    },
    onEmptyQueue: {
      destroyAfterMs: -1
      // autoPlayFunction: autoPlayFunction,
    }
  },
  queueOptions: {
    maxPreviousTracks: 25
  }
})

Client.prototype.locale = async function (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) {
  const locale = await client.mysql.query('SELECT language FROM user WHERE id = ?', [interaction.user.id])
  if (locale.language == null) {
    return translate(interaction.locale, key, ...args)
  } else {
    return translate(locale.language, key, ...args)
  }
}

const commands: any = []
const commandFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './commands'))
for (const folders of commandFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./commands/${folders}`))
  for (const file of folder) {
    const command = (await import(`./commands/${folders}/${file}`)).default
    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
  }
}

const eventFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './events'))
for (const folders of eventFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./events/${folders}`))
  for (const file of folder) {
    const event = (await import(`./events/${folders}/${file}`)).default
    if (folders === 'client' || folders === 'interaction') {
      client.on(event.name, (...args) =>
        event.execute(...args).catch(async (error: any) => {
          logger.error(error)
          await client.users.cache.get('332840377763758082')?.send(`${error.stack}`)
        })
      )
    }
  }
}

client.on('raw', async (d) => {
  await client.lavalink.sendRawData(d)
})
client.on('ready', async () => {
  await client.lavalink.init({ ...client.user!, username: 'GreenBot' })
  await client.guilds.cache.get('825741743235268639')?.commands.set(commands)
  await client.application?.commands.set(commands)
})
await client.login(process.env.BETA_TOKEN)

process.on('uncaughtException', (error) => {
  logger.error(error.stack)
})

process.on('unhandledRejection', (error: any) => {
  logger.error(error.stack)
})

process.on('SIGINT', async () => {
  client.logger.info('Disconnecting from Discord...')
  await client.destroy()
  client.logger.info('Successfully disconnected from Discord!')
  process.exit()
})
