import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import dayjs from 'dayjs'
import duration from 'dayjs/plugin/duration.js'
dayjs.extend(duration)

function progressBar (current: number, total: number, size = 14): string {
  if (current > total) current = total
  const currentPosition = Math.round((size * current) / total)
  const bar = '▬'.repeat(currentPosition) + '🔘' + '▬'.repeat(size - currentPosition)
  const currentTimeFormattedRaw = dayjs.duration(current).format('HH:mm:ss')
  const totalTimeFormattedRaw = dayjs.duration(total).format('HH:mm:ss')
  const currentTimeFormatted = currentTimeFormattedRaw.startsWith('00:') ? currentTimeFormattedRaw.substring(3) : currentTimeFormattedRaw
  const totalTimeFormatted = totalTimeFormattedRaw.startsWith('00:') ? totalTimeFormattedRaw.substring(3) : totalTimeFormattedRaw
  return `${currentTimeFormatted} ┃ ${bar} ┃ ${totalTimeFormatted}`
}

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setNameLocalizations({
      ko: '재생중'
    })
    .setDescription('Shows the currently playing music information.')
    .setDescriptionLocalizations({
      ko: '현재 재생중인 음악 정보를 알려줍니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId)
    if (player?.queue.current == null) {
      return interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const bar = progressBar(player.position, player.queue.current.info.duration)
    const percent = Math.round((player.position / player.queue.current.info.duration) * 100)
    const embed = new EmbedBuilder()
      .setURL(player.queue.current.info.uri)
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.nowplaying.title'))
      .setDescription(player.queue.current.info.title)
      .setThumbnail(player.queue.current.info.artworkUrl ?? '')
      .addFields([
        { name: await interaction.client.i18n(interaction, 'command.nowplaying.author'), value: player.queue.current.info.author },
        { name: await interaction.client.i18n(interaction, 'command.nowplaying.progress', { percent }), value: bar },
        { name: await interaction.client.i18n(interaction, 'command.nowplaying.source_name'), value: player.queue.current.info.sourceName }
      ])
    await interaction.followUp({ embeds: [embed] })
  }
}
