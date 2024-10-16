import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('재생목록')
    .setDescription('노래 재생목록을 확인합니다.'),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const titleArray: string[] = []
    queue.tracks.toArray().slice(0, queue.tracks.toArray().length).forEach((track) => {
      titleArray.push(track.title)
    })

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`재생목록 - ${titleArray.length}개`)
      .addFields(
        { name: '재생중', value: `${queue.currentTrack.title}` },
        { name: '진행도', value: `${queue.node.createProgressBar()}` })
      .setThumbnail(queue.currentTrack.thumbnail)

    for (let i = 0; i < titleArray.length; i++) {
      if (i === 21) {
        embed.addFields({ name: `(${titleArray.length - 22}개의 음악)`, value: '이하 생략' })
        break
      }
      embed.addFields({ name: (i + 1).toString(), value: titleArray[i] })
    }
    await interaction.followUp({ embeds: [embed] })
  }
}
