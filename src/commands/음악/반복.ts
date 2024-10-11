import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, QueueRepeatMode } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('반복')
    .setDescription('재생중인 노래를 반복합니다.')
    .addStringOption(option => option
      .setName('유형')
      .setDescription('필터를 지정해 주세요.')
      .addChoices({ name: '끄기', value: 'off' })
      .addChoices({ name: '트랙', value: 'track' })
      .addChoices({ name: '재생목록', value: 'queue' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const option = interaction.options.getString('유형')

    if (option === 'track') {
      queue.setRepeatMode(QueueRepeatMode.TRACK)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 현재 재생중인 음악을 반복 재생합니다!')
        .setDescription(queue.currentTrack.title)
      await interaction.followUp({ embeds: [embed] })
    }

    if (option === 'queue') {
      queue.setRepeatMode(QueueRepeatMode.QUEUE)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 전체 대기열을 반복 재생합니다!')
        .setDescription(`${queue.currentTrack.title} 외 ${queue.tracks.toArray().length}개의 음악`)
      await interaction.followUp({ embeds: [embed] })
    }

    if (option === 'off') {
      queue.setRepeatMode(QueueRepeatMode.OFF)
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 반복모드가 꺼졌습니다!')
        .setDescription(`${queue.currentTrack?.title}`)
      await interaction.followUp({ embeds: [embed] })
    }
  }
}
