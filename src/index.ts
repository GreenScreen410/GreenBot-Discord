import path from 'node:path';
import { ShardingManager } from 'discord.js';
import { logger } from './handler/logger.js';

const botFile = path.join(import.meta.dir, 'bot.ts');

const manager = new ShardingManager(botFile, {
  token: process.env.TOKEN
});

manager.on('shardCreate', (shard) => {
  logger.info(`Launched shard ${shard.id}`);
});

manager.spawn({
  delay: 5000,
  timeout: 60000
});
