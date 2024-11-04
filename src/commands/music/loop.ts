import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setNameLocalizations({
      ko: '반복'
    })
    .setDescription('Loop the current track or the whole queue.')
    .setDescriptionLocalizations({
      ko: '재생중인 음악을 반복합니다.'
    })
    .addStringOption(option => option
      .setName('type')
      .setNameLocalizations({
        ko: '유형'
      })
      .setDescription('Specify the target to repeat.')
      .setDescriptionLocalizations({
        ko: '반복할 대상을 지정해 주세요.'
      })
      .addChoices({
        name: 'Off',
        name_localizations: {
          ko: '끄기'
        },
        value: 'off'
      })
      .addChoices({
        name: 'Track',
        name_localizations: {
          ko: '트랙'
        },
        value: 'track'
      })
      .addChoices({
        name: 'Queue',
        name_localizations: {
          ko: '재생목록'
        },
        value: 'queue'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.players.get(interaction.guildId)
    if (player == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const option = interaction.options.getString('type')

    if (option === 'track') {
      await player.setRepeatMode('track')
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 현재 재생중인 음악을 반복 재생합니다!')
        .setDescription(player.queue.tracks[0].info.title)
      await interaction.followUp({ embeds: [embed] })
    }

    if (option === 'queue') {
      await player.setRepeatMode('queue')
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 전체 대기열을 반복 재생합니다!')
        .setDescription(`${player.queue.tracks[0].info.title} 외 ${player.queue.tracks.length}개의 음악`)
      await interaction.followUp({ embeds: [embed] })
    }

    if (option === 'off') {
      await player.setRepeatMode('off')
      const embed = new EmbedBuilder()
        .setColor('Random')
        .setTitle('🔁 반복모드가 꺼졌습니다!')
        .setDescription(player.queue.tracks[0].info.title)
      await interaction.followUp({ embeds: [embed] })
    }
  }
}
