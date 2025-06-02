import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { type RepeatMode } from 'lavalink-client/dist/types'

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
    const player = interaction.client.lavalink.getPlayer(interaction.guildId)
    if (player?.queue.current == null) {
      return interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const option = interaction.options.getString('type') as RepeatMode
    await player.setRepeatMode(option)

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.i18n(interaction, `command.loop.${option}`))
      .setDescription(player.queue.current.info.title ?? '')
      .setURL(player.queue.current.info.uri ?? '')
      .setThumbnail(player.queue.current.info.artworkUrl ?? '')
    await interaction.followUp({ embeds: [embed] })
  }
}
