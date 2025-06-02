import { type Collection } from 'discord.js'
import type { LavalinkManager } from 'lavalink-client'
import type ErrorHandler from '../src/handler/error.js'
import type MySQLHandler from '../src/handler/mysql.js'

declare module 'discord.js' {
  interface Client {
    commands: Collection<string, any>
    error: typeof ErrorHandler
    mysql: typeof MySQLHandler
    prisma: any
    lavalink: LavalinkManager
    i18n: (interaction: { locale: string, user: { id: string } }, key: string, ...args: unknown[]) => Promise<string>
  }
}
