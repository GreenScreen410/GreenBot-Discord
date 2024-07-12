import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { QueryType, type SearchQueryType, useMainPlayer } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('재생')
    .setDescription('노래를 재생합니다.')
    .addStringOption((option) => option
      .setName('노래')
      .setDescription('노래 제목을 입력해 주세요.')
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    if (interaction.member.voice.channel == null) {
      return await interaction.client.error.PLEASE_JOIN_VOICE_CHANNEL(interaction)
    }
    if (((interaction.guild.members.me?.voice.channelId) != null) && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const query = interaction.options.getString('노래', true)
    const player = useMainPlayer()
    const results = await player.search(query)
    const track = await player.play(interaction.member.voice.channel, results, {
      nodeOptions: {
        metadata: interaction
      }
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎵 재생목록에 추가되었습니다.\n[긴급] 음악 명령어가 많이 불안정합니다.')
      .setDescription(track.track.title)
      .setURL(track.track.url)
      .setThumbnail(track.track.thumbnail)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    await interaction.followUp({ embeds: [embed] })
  }
}
