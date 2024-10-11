import { type ChatInputCommandInteraction, EmbedBuilder } from 'discord.js'
import { GuildQueueEvent, type GuildQueue, type Track, QueueRepeatMode } from 'discord-player'

export default {
  name: GuildQueueEvent.PlayerStart,

  async execute (queue: GuildQueue<{ interaction: ChatInputCommandInteraction<'cached'> }>, track: Track) {
    console.log(`[PlayerStart] ${track.title}`)

    const interaction = queue.metadata.interaction
    if (queue.repeatMode !== QueueRepeatMode.OFF) return

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎵 지금 재생 중입니다!')
      .setDescription(`${track.title}`)
      .setThumbnail(`${track.thumbnail}`)
    await interaction.channel?.send({ embeds: [embed] })
  }
}
