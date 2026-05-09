import { type Client, Events } from 'discord.js';
import type { ChannelDeletePacket, VoicePacket, VoiceServer, VoiceState } from 'lavalink-client';

export default {
  name: Events.Raw,

  async execute(client: Client, d: unknown) {
    client.lavalink.sendRawData(d as VoicePacket | VoiceServer | VoiceState | ChannelDeletePacket);
  }
};
