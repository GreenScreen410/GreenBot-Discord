import 'dotenv/config.js'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { LavalinkManager } from 'lavalink-client'
import { readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import consoleStamp from 'console-stamp'
consoleStamp(console, { format: ':date(yyyy-mm-dd HH:MM:ss.l)' })
const __dirname = dirname(fileURLToPath(import.meta.url))

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>
    buttons: Collection<string, any>
    error: typeof import('./handler/error.js').default
    mysql: typeof import('./handler/mysql.js').default
    lavalink: LavalinkManager
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
}) as Client & { lavalink: LavalinkManager }
client.commands = new Collection()
client.buttons = new Collection()
client.error = (await import('./handler/error.js')).default
client.mysql = (await import('./handler/mysql.js')).default
client.lavalink = new LavalinkManager({
  nodes: [
    { id: 'Local Node', host: `${process.env.SERVER_IP}`, port: 2333, authorization: `${process.env.LAVALINK_PASSWORD}`, retryAmount: 5, retryDelay: 60000, secure: false }
  ],
  sendToShard: (guildId, payload) =>
    client.guilds.cache.get(guildId)?.shard?.send(payload),
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

const commands: any = []
const commandFiles = await readdir(join(__dirname, './commands'))
for (const folders of commandFiles) {
  const folder = await readdir(join(__dirname, `./commands/${folders}`))
  for (const file of folder) {
    const command = (await import(`./commands/${folders}/${file}`)).default
    client.commands.set(command.data.name, command)
    commands.push(command.data.toJSON())
  }
}

const eventFiles = await readdir(join(__dirname, './events'))
for (const folders of eventFiles) {
  const folder = await readdir(join(__dirname, `./events/${folders}`))
  for (const file of folder) {
    const event = (await import(`./events/${folders}/${file}`)).default
    if (folders === 'client' || folders === 'interaction') {
      client.on(event.name, (...args) => event.execute(...args).catch(async (error: any) => {
        console.log(error)
        await client.users.cache.get('332840377763758082')?.send(`${error.stack}`)
      }
      ))
    }
  }
}

client.on('raw', async d => { await client.lavalink.sendRawData(d) })
client.on('ready', async () => {
  await client.lavalink.init({ ...client.user!, username: 'GreenBot' })
  await client.guilds.cache.get('825741743235268639')?.commands.set(commands)
  await client.application?.commands.set(commands)
})
await client.login(process.env.BETA_TOKEN)
