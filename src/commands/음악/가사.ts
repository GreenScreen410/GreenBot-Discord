import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { lyricsExtractor } from '@discord-player/extractor'

export default {
  data: new SlashCommandBuilder()
    .setName('가사')
    .setDescription('노래 가사를 검색합니다.')
    .addStringOption((option) => option
      .setName('노래')
      .setDescription('노래 제목을 입력해 주세요.')
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }

    let song = interaction.options.getString('노래')
    if (song == null) {
      song = queue.currentTrack.title
    }

    const lyricsFinder = lyricsExtractor(process.env.GENIUS_API)
    const lyrics = await lyricsFinder.search(song).catch(() => null)
    if (lyrics == null) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, song)
    }

    const trimmedLyrics = lyrics.lyrics.substring(0, 1997)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(lyrics.title)
      .setURL(lyrics.url)
      .setThumbnail(lyrics.thumbnail)
      .setAuthor({ name: lyrics.artist.name, iconURL: lyrics.artist.image, url: lyrics.artist.url })
      .setDescription(trimmedLyrics.length === 1997 ? `${trimmedLyrics}...` : trimmedLyrics)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    return await interaction.followUp({ embeds: [embed] })
  }
}
