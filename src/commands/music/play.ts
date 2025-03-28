import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

function msToTime (ms: number): string {
  const hours = Math.floor(ms / 3600000)
  const minutes = Math.floor((ms % 3600000) / 60000)
  const seconds = Math.floor((ms % 60000) / 1000)
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`
}

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setNameLocalizations({
      ko: '재생'
    })
    .setDescription('Play a music.')
    .setDescriptionLocalizations({
      ko: '음악을 재생합니다.'
    })
    .addStringOption((option) => option
      .setName('query')
      .setNameLocalizations({
        ko: '음악'
      })
      .setDescription('Enter the title or link.')
      .setDescriptionLocalizations({
        ko: '제목, 또는 링크를 입력해 주세요.'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    if (interaction.member.voice.channel == null || interaction.member.voice.channelId == null) {
      return await interaction.client.error.PLEASE_JOIN_VOICE_CHANNEL(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const query = interaction.options.getString('query', true)
    const player = interaction.client.lavalink.getPlayer(interaction.guildId) ?? interaction.client.lavalink.createPlayer({
      guildId: interaction.guildId,
      voiceChannelId: interaction.member.voice.channelId,
      textChannelId: interaction.channelId,
      selfDeaf: true,
      selfMute: false,
      volume: 100,
      instaUpdateFiltersFix: true,
      applyVolumeAsFilter: false
    })

    if (player.connected === false) await player.connect()

    const result = await player.search({ query }, interaction.user)
    if (result.tracks.length === 0) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, query)
    }

    await player.queue.add(result.loadType === 'playlist' ? result.tracks : result.tracks[0])
    if (result.loadType === 'playlist' && result.playlist != null) {
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(await interaction.client.locale(interaction, 'command.play.title'))
        .setDescription(result.playlist.name)
        .addFields([
          { name: await interaction.client.locale(interaction, 'command.play.track_count'), value: `${result.tracks.length}` },
          { name: await interaction.client.locale(interaction, 'command.play.duration'), value: msToTime(result.playlist.duration) }
        ])

      if (result.playlist.uri != null) {
        embed.setURL(result.playlist.uri)
      }
      if (result.playlist.thumbnail != null) {
        embed.setThumbnail(result.playlist.thumbnail)
      }

      await interaction.followUp({ embeds: [embed] })
    } else {
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(await interaction.client.locale(interaction, 'command.play.title'))
        .setDescription(result.tracks[0].info.title)
        .addFields([
          { name: await interaction.client.locale(interaction, 'command.play.author'), value: result.tracks[0].info.author ?? 'N/A' },
          { name: await interaction.client.locale(interaction, 'command.play.source_name'), value: result.tracks[0].info.sourceName ?? 'N/A' },
          { name: await interaction.client.locale(interaction, 'command.play.duration'), value: result.tracks[0].info.duration != null ? (result.tracks[0].info.isStream === true ? 'Live' : msToTime(result.tracks[0].info.duration)) : 'N/A' }
        ])

      if (result.tracks[0].info.uri != null) {
        embed.setURL(result.tracks[0].info.uri)
      }
      if (result.tracks[0].info.artworkUrl != null) {
        embed.setThumbnail(result.tracks[0].info.artworkUrl)
      }

      await interaction.followUp({ embeds: [embed] })
    }

    if (!player.playing) await player.play()
  }
}
