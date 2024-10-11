import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('정지')
    .setDescription('모든 음악 대기열을 초기화하고, 종료합니다.'),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    queue.delete()

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🚫 정지!')
      .setDescription('음악 재생을 정상적으로 종료하였습니다.')
    await interaction.followUp({ embeds: [embed] })
  }
}
