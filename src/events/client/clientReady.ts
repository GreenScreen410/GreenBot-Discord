import { type Client, Events } from 'discord.js';
import { logger } from '@/handler/logger.js';

export default {
  name: Events.ClientReady,
  once: true,

  async execute(client: Client) {
    const user = client.user;
    if (user == null) return;

    client.lavalink.init({ id: user.id });
    logger.info(`Successfully logged in as ${user.username} (${user.id})`);
  }
};
