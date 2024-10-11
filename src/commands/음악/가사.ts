import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'
import { lyricsExtractor } from '@discord-player/extractor'

export default {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setNameLocalizations({
      ko: '가사'
    })
    .setDescription('Searches for song lyrics. If a song is currently playing, you don\'t need to enter the song title.')
    .setDescriptionLocalizations({
      ko: '노래 가사를 검색합니다. 재생중인 노래가 있을 경우 노래 제목을 입력하지 않아도 됩니다.'
    })
    .addStringOption((option) => option
      .setName('song')
      .setNameLocalizations({
        ko: '노래'
      })
      .setDescription('Please enter the song title.')
      .setDescriptionLocalizations({
        ko: '노래 제목을 입력해 주세요.'
      })
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    let song = interaction.options.getString('노래')
    if (song == null) {
      const queue = useQueue(interaction.guildId)

      if (queue?.currentTrack == null) {
        return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
      }

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
    return await interaction.followUp({ embeds: [embed] })
  }
}
