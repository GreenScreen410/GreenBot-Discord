import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('제거')
    .setDescription('재생목록에서 특정 음악을 제거합니다.')
    .addIntegerOption((option) => option
      .setName('번호')
      .setDescription('제거할 음악 번호를 입력해주세요. 음악 번호는 재생목록 명령어에서 확인할 수 있습니다.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction); return
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction); return
    }
    if (queue.tracks.size <= 1) {
      queue.node.skip()

      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('⏩ 재생중인 노래를 넘겼습니다!')
        .setDescription(`${queue.currentTrack?.title}`)
        .setTimestamp()
        .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
      return await interaction.followUp({ embeds: [embed] })
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🗑️ 정상적으로 제거하였습니다.')
      .setDescription(queue.tracks.data[0].title)
      .setURL(queue.tracks.data[0].url)
      .setThumbnail(queue.tracks.data[0].thumbnail)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    await interaction.followUp({ embeds: [embed] })

    const index = interaction.options.getInteger('번호', true)
    queue.removeTrack(index - 1)
  }
}
