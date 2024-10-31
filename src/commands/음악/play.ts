import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

function msToTime (s: number): string {
  const pad = (n: any, z = 2): string => ('00' + n).slice(-z)
  return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0)
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
    if (interaction.member.voice.channel == null) {
      return await interaction.client.error.PLEASE_JOIN_VOICE_CHANNEL(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const query = interaction.options.getString('query', true)
    const player = interaction.client.lavalink.createPlayer({
      guildId: interaction.guildId,
      voiceChannelId: interaction.member.voice.channelId!,
      selfDeaf: true,
      selfMute: false,
      volume: 100
    })

    await player.connect()
    const result = await player.search({ query }, interaction.user)

    await player.queue.add(result.tracks[0])
    if (!player.playing) await player.play()

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎵 재생목록에 추가되었습니다.')
      .setDescription(result.tracks[0].info.title)
      .setURL(result.tracks[0].info.uri ?? '')
      .setThumbnail(result.tracks[0].info.artworkUrl ?? '')
      .addFields([
        { name: '작곡가', value: result.tracks[0].info.author ?? 'N/A' },
        { name: '길이', value: result.tracks[0].info.isStream ? 'LIVE' : msToTime(result.tracks[0].info.duration!) },
        { name: '음악 출처', value: result.tracks[0].info.sourceName ?? 'N/A' }
      ])
    await interaction.followUp({ embeds: [embed] })
  }
}
