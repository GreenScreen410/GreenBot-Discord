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
    const player = interaction.client.lavalink.createPlayer({
      guildId: interaction.guildId,
      voiceChannelId: interaction.member.voice.channelId,
      selfDeaf: true,
      selfMute: false,
      volume: 100
    })

    await player.connect()
    const result = await player.search({ query }, interaction.user)

    if (result.tracks == null) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, query)
    }

    await player.queue.add(result.loadType === 'playlist' ? result.tracks : result.tracks[0])
    if (!player.playing) await player.play()

    if (result.loadType === 'playlist' && result.playlist != null) {
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(await interaction.client.locale(interaction, 'command.play.title'))
        .setDescription(result.playlist.name)
        .setURL(result.tracks[0].info.uri ?? '')
        .setThumbnail(result.tracks[0].info.artworkUrl ?? '')
        .addFields([
          { name: await interaction.client.locale(interaction, 'command.play.track_count'), value: `${result.tracks.length}` },
          { name: await interaction.client.locale(interaction, 'command.play.duration'), value: msToTime(result.playlist.duration) }
        ])
      await interaction.followUp({ embeds: [embed] })
    } else {
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle(await interaction.client.locale(interaction, 'command.play.title'))
        .setDescription(result.tracks[0].info.title)
        .setURL(result.tracks[0].info.uri ?? '')
        .setThumbnail(result.tracks[0].info.artworkUrl ?? '')
        .addFields([
          { name: await interaction.client.locale(interaction, 'command.play.author'), value: result.tracks[0].info.author ?? 'N/A' },
          { name: await interaction.client.locale(interaction, 'command.play.source_name'), value: result.tracks[0].info.sourceName ?? 'N/A' },
          { name: await interaction.client.locale(interaction, 'command.play.duration'), value: result.tracks[0].info.duration != null ? (result.tracks[0].info.isStream === true ? 'Live' : msToTime(result.tracks[0].info.duration)) : 'N/A' }
        ])
      await interaction.followUp({ embeds: [embed] })
    }
  }
}
