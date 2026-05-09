import type { ChatInputCommandInteraction } from 'discord.js';

export function isInSameVoiceChannel(interaction: ChatInputCommandInteraction<'cached'>): boolean {
  const botChannel = interaction.guild.members.me?.voice.channelId;
  const userChannel = interaction.member.voice.channelId;
  if (botChannel == null) return true;
  return botChannel === userChannel;
}
