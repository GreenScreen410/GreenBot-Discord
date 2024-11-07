import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setNameLocalizations({
      ko: '제거'
    })
    .setDescription('Remove a specific music from the playlist.')
    .setDescriptionLocalizations({
      ko: '재생목록에서 특정 음악을 제거합니다.'
    })
    .addIntegerOption((option) => option
      .setName('number')
      .setNameLocalizations({
        ko: '번호'
      })
      .setDescription('You can check the music number with the playlist command.')
      .setDescriptionLocalizations({
        ko: '제거할 음악 번호를 입력해주세요. 음악 번호는 재생목록 명령어에서 확인할 수 있습니다.'
      })
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.players.get(interaction.guildId)
    if (player == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const index = interaction.options.getInteger('number', true) - 1
    if (index < 0 || index >= player.queue.tracks.length) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, index)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.remove.title'))
      .setDescription(player.queue.tracks[0].info.title)
    await interaction.followUp({ embeds: [embed] })

    await player.queue.remove(index - 1)
  }
}
