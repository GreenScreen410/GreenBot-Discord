import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';
import { ShardingManager } from 'discord.js';
import { logger } from './handler/logger.js';

const botFile = join(dirname(fileURLToPath(import.meta.url)), 'bot.ts');

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
