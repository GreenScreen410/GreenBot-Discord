import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setNameLocalizations({
      ko: '정지'
    })
    .setDescription('Stop all music queue and exit.')
    .setDescriptionLocalizations({
      ko: '모든 음악 대기열을 초기화하고, 종료합니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId)
    if (player == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    await player.destroy()

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.stop.title'))
      .setDescription(await interaction.client.locale(interaction, 'command.stop.description'))
    await interaction.followUp({ embeds: [embed] })
  }
}
