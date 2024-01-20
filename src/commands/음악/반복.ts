import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, QueueRepeatMode } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('반복')
    .setDescription('재생중인 노래를 반복합니다.'),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction); return
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction); return
    }

    if (queue.repeatMode === QueueRepeatMode.OFF) {
      queue.setRepeatMode(QueueRepeatMode.TRACK)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 반복모드가 켜졌습니다!')
        .setDescription(`${queue.currentTrack?.title}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      await interaction.followUp({ embeds: [embed] })
    } else {
      queue.setRepeatMode(QueueRepeatMode.OFF)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 반복모드가 꺼졌습니다!')
        .setDescription(`${queue.currentTrack?.title}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      await interaction.followUp({ embeds: [embed] })
    }
  }
}
