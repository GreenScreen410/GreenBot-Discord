import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue, useTimeline } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('재생중')
    .setDescription('현재 재생중인 노래 정보를 알려줍니다.'),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction); return
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction); return
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🎵 재생중인 노래')
      .setDescription(`${queue.currentTrack.title}`)
      .addFields([
        { name: '작곡가', value: queue.currentTrack.author },
        { name: '진행도', value: `${queue.node.createProgressBar()} (${useTimeline(interaction.guild.id)?.timestamp?.progress}%)` },
        { name: '음악 출처', value: `\`${queue.currentTrack.extractor?.identifier == null || 'N/A'}\`` }
      ])
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })
    await interaction.followUp({ embeds: [embed] })
  }
}
