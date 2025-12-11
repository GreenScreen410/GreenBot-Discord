import { readdir } from 'node:fs/promises'
import { dirname, join } from 'node:path'
import { fileURLToPath } from 'node:url'
import { PrismaMariaDb } from '@prisma/adapter-mariadb'
import { Client, Collection, GatewayIntentBits } from 'discord.js'
import type { ChannelDeletePacket, VoicePacket, VoiceServer, VoiceState } from 'lavalink-client'
import { PrismaClient } from './generated/prisma/client.js'
import 'dotenv/config'

const databaseUrl = new URL(process.env.DATABASE_URL ?? '')
const adapter = new PrismaMariaDb({
  host: databaseUrl.hostname,
  port: Number(databaseUrl.port) || 3306,
  user: databaseUrl.username,
  password: process.env.DATABASE_PASSWORD ?? databaseUrl.password,
  database: databaseUrl.pathname.slice(1),
  allowPublicKeyRetrieval: true
})

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildVoiceStates, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent]
})
client.commands = new Collection()
client.prisma = new PrismaClient({ adapter })
client.lavalink = (await import('./handler/lavalink.js')).default(client)

const commands: unknown[] = []
const commandFiles = await readdir(join(dirname(fileURLToPath(import.meta.url)), './commands'))
for (const folders of commandFiles) {
  const folder = await readdir(join(dirname(fileURLToPath(import.meta.url)), `./commands/${folders}`))
  for (const file of folder) {
    if (file.includes('_')) continue
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
    if (folders === 'client' || folders === 'interaction' || folders === 'message') {
      if (event.once === true) {
        client.once(event.name, (...args: unknown[]) => event.execute(...args))
      } else {
        client.on(event.name, (...args: unknown[]) => event.execute(...args))
      }
    } else if (folders === 'lavalink') {
      client.lavalink.on(event.name, (...args: unknown[]) => event.execute(...args))
    }
  }
}

client.on('raw', (d) => {
  void client.lavalink.sendRawData(d as VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket)
})

await client.login(process.env.BETA_TOKEN)
