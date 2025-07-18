import { ShardingManager } from 'discord.js'
import 'dotenv/config'

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env.BETA_TOKEN
})

manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`)
})

manager.spawn()
