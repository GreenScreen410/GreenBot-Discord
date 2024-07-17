import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('정지')
    .setDescription('모든 음악 대기열을 초기화하고, 종료합니다.'),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🚫 정지!')
      .setDescription('음악 재생을 정상적으로 종료하였습니다.')
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })
    await interaction.followUp({ embeds: [embed] })

    if (queue.size >= 10) {
      // await interaction.client.achievements.get(interaction, 'ruin_the_fun')
    }

    queue.delete()
  }
}
