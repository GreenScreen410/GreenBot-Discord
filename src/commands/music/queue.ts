import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setNameLocalizations({
      ko: '재생목록'
    })
    .setDescription('Check the music playlist.')
    .setDescriptionLocalizations({
      ko: '음악 재생목록을 확인합니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.players.get(interaction.guildId)
    if (player?.queue.current == null) {
      return interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, 'command.queue.title', { size: player.queue.tracks.length }))
      .setDescription([
        '## 현재 음악:',
        `> ### [\`${player.queue.current?.info.title}\`](${player.queue.current?.info.uri})`,
        `## ${player.queue.tracks.length > 20 ? 20 : player.queue.tracks.length}개의 대기열:`,
        player.queue.tracks.slice(0, 20)
          .map((t, i) => `> **${i + 1}.** [\`${t.info.title}\`](${t.info.uri})`).join('\n')
      ].join('\n'))
    await interaction.followUp({ embeds: [embed] })
  }
}
