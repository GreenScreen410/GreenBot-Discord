import { ShardingManager } from 'discord.js'
import 'dotenv/config'

const manager = new ShardingManager('./dist/bot.js', {
  token: process.env.TOKEN,
  respawn: true,
  totalShards: 'auto',
  shardList: 'auto'
})

manager.on('shardCreate', shard => {
  console.log(`Launched shard ${shard.id}`)
  console.log(`Shard ${shard.id} is ready`)
})

await manager.spawn()
