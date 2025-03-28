import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

function msToTime (s: number): string {
  const pad = (n: any, z = 2): string => ('00' + n).slice(-z)
  return pad(s / 3.6e6 | 0) + ':' + pad((s % 3.6e6) / 6e4 | 0) + ':' + pad((s % 6e4) / 1000 | 0)
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
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const embed = new EmbedBuilder()
      .setURL(player.queue.current.info.uri)
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.nowplaying.title'))
      .setDescription(player.queue.current.info.title)
      .setThumbnail(player.queue.current.info.artworkUrl ?? '')
      .addFields([
        { name: await interaction.client.locale(interaction, 'command.nowplaying.author'), value: player.queue.current.info.author },
        { name: await interaction.client.locale(interaction, 'command.nowplaying.duration'), value: msToTime(player.queue.current.info.duration) },
        { name: await interaction.client.locale(interaction, 'command.nowplaying.source_name'), value: player.queue.current.info.sourceName }
      ])
    await interaction.followUp({ embeds: [embed] })
  }
}
