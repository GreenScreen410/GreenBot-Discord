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

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const index = interaction.options.getInteger('번호', true) - 1
    if (index < 0 || index >= queue.tracks.size) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, '음악 번호가 잘못되었습니다.')
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🗑️ 정상적으로 제거되었습니다.')
      .setDescription(queue.tracks.data[index].title)
      .setURL(queue.tracks.data[index].url)
      .setThumbnail(queue.tracks.data[index].thumbnail)
    await interaction.followUp({ embeds: [embed] })

    queue.removeTrack(index)
  }
}
