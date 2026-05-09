import type { Client } from 'discord.js';
import { LavalinkManager } from 'lavalink-client';
import { logger } from './logger.js';

export default function (client: Client): LavalinkManager {
  logger.info('Initializing Lavalink manager');
  return new LavalinkManager({
    nodes: [
      {
        id: 'Local Node',
        host: process.env.SERVER_IP,
        port: 2333,
        authorization: process.env.LAVALINK_PASSWORD,
        retryAmount: 5,
        retryDelay: 60000,
        secure: false
      }
    ],
    sendToShard: (guildId, payload) => client.guilds.cache.get(guildId)?.shard?.send(payload),
    // everything down below is optional
    autoSkip: true,
    playerOptions: {
      clientBasedPositionUpdateInterval: 150,
      defaultSearchPlatform: 'ytsearch',
      volumeDecrementer: 0.75,
      // requesterTransformer: requesterTransformer,
      onDisconnect: {
        autoReconnect: false,
        destroyPlayer: true
      },
      onEmptyQueue: {
        destroyAfterMs: 0
        // autoPlayFunction: autoPlayFunction,
      }
    },
    queueOptions: {
      maxPreviousTracks: 25
    }
  });
}
