import { ActionRowBuilder, ButtonBuilder, type ButtonInteraction, ButtonStyle, type ChatInputCommandInteraction, ComponentType, EmbedBuilder, SlashCommandBuilder } from 'discord.js'
import { Client as GeniusClient } from 'genius-lyrics'

function paginateLyrics (lyrics: string): string[] {
  const lines = lyrics.split('\n')
  const pages: string[] = []
  let page = ''

  for (const line of lines) {
    if (page.length + line.length + 1 > 4096) {
      pages.push(page)
      page = ''
    }
    page += `${line}\n`
  }

  if (page != null) pages.push(page)
  return pages
}

export default {
  data: new SlashCommandBuilder()
    .setName('lyrics')
    .setNameLocalizations({
      ko: '가사'
    })
    .setDescription('Shows the lyrics of a song.')
    .setDescriptionLocalizations({
      ko: '노래의 가사를 보여줍니다.'
    })
    .addStringOption(option =>
      option
        .setName('search')
        .setNameLocalizations({
          ko: '검색어'
        })
        .setDescription('Enter any song title, artist, or keywords to search lyrics')
        .setDescriptionLocalizations({
          ko: '노래 제목, 아티스트, 또는 아무 검색어나 입력하세요'
        })
        .setRequired(false)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const embed = new EmbedBuilder()
    let searchQuery = interaction.options.getString('search')

    if (searchQuery == null) {
      const player = interaction.client.lavalink.getPlayer(interaction.guildId)
      if (player?.queue.current == null) {
        return interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
      }
      if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
        return interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
      }

      const track = player.queue.current
      const title = track.info.title.replace(/\[.*?\]|\(.*?\)/g, '').trim()
      const artist = track.info.author.replace(/\[.*?\]|\(.*?\)/g, '').trim()
      searchQuery = `${artist} ${title}`
    }

    const geniusClient = new GeniusClient(process.env.GENIUS_API)
    const searches = await geniusClient.songs.search(searchQuery)
    const song = searches[0]
    if (song == null) {
      return interaction.client.error.INVALID_ARGUMENT(interaction, searchQuery)
    }

    const lyrics = await song.lyrics()
    const lyricsPages = paginateLyrics(lyrics)
    let currentPage = 0

    const trackTitle = song.title
    const artistName = song.artist.name
    const trackUrl = song.url
    const artworkUrl = song.thumbnail

    const createComponents = (disabled = false, end = false): ActionRowBuilder<ButtonBuilder> => {
      return new ActionRowBuilder<ButtonBuilder>().addComponents(
        new ButtonBuilder()
          .setCustomId('prev')
          .setEmoji('◀️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(disabled || currentPage === 0),
        new ButtonBuilder()
          .setCustomId('next')
          .setEmoji('▶️')
          .setStyle(ButtonStyle.Secondary)
          .setDisabled(disabled || currentPage === lyricsPages.length - 1)
      )
    }

    const reply = await interaction.editReply({
      embeds: [
        embed
          .setColor('Random')
          .setTitle(`${trackTitle} - ${artistName}`)
          .setURL(trackUrl)
          .setDescription(lyricsPages[currentPage])
          .setThumbnail(artworkUrl)
          .setFooter({ text: `페이지 ${currentPage + 1}/${lyricsPages.length}` })
          .setTimestamp()
      ],
      components: [createComponents()]
    })

    const filter = (i: ButtonInteraction<'cached'>) => i.user.id === interaction.user.id
    const collector = reply.createMessageComponentCollector({
      filter,
      componentType: ComponentType.Button,
      time: 120000
    })

    collector.on('collect', async (buttonInteraction: ButtonInteraction<'cached'>) => {
      if (buttonInteraction.customId === 'prev') {
        currentPage--
      } else if (buttonInteraction.customId === 'next') {
        currentPage++
      }

      await buttonInteraction.update({
        embeds: [embed
          .setDescription(lyricsPages[currentPage]).setFooter({ text: `페이지 ${currentPage + 1}/${lyricsPages.length}` })
        ],
        components: [createComponents()]
      })
    })
  }
}
