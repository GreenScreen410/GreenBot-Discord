import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setNameLocalizations({
      ko: '넘기기'
    })
    .setDescription('Skips the currently playing song.')
    .setDescriptionLocalizations({
      ko: '재생중인 노래를 넘깁니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    queue.node.skip()

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('⏩ 재생중인 노래를 넘겼습니다!')
      .setDescription(`${queue.currentTrack.title}`)
    await interaction.followUp({ embeds: [embed] })
  }
}
