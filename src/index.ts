import 'dotenv/config.js'
import { Client, GatewayIntentBits, Collection } from 'discord.js'
import { Player } from 'discord-player'
import { readdir } from 'node:fs/promises'
import { join, dirname } from 'node:path'
import { fileURLToPath } from 'node:url'
import { YoutubeiExtractor } from 'discord-player-youtubei'
import consoleStamp from 'console-stamp'
consoleStamp(console, { format: ':date(yyyy-mm-dd HH:MM:ss.l)' })
const __dirname = dirname(fileURLToPath(import.meta.url))

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>
    buttons: Collection<string, any>
    error: typeof import('./handler/error.js').default
    mysql: typeof import('./handler/mysql.js').default
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates]
})
client.commands = new Collection()
client.buttons = new Collection()
client.error = (await import('./handler/error.js')).default
client.mysql = (await import('./handler/mysql.js')).default

const player = new Player(client)
await player.extractors.register(YoutubeiExtractor, {
  authentication: process.env.YOUTUBE_OAUTH
})
await player.extractors.loadDefault((ext) => !['YouTubeExtractor'].includes(ext))

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
      client.on(event.name, (...args) => event.execute(...args).catch(async (error: any) => await client.users.cache.get('332840377763758082')?.send(`${error.stack}`)))
    } else if (folders === 'player') {
      player.events.on(event.name, (...args: any) => event.execute(...args))
    }
  }
}

client.on('ready', async () => {
  await client.guilds.cache.get('825741743235268639')?.commands.set(commands)
  await client.application?.commands.set(commands)
})
await client.login(process.env.BETA_TOKEN)
