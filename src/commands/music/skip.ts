import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setNameLocalizations({
      ko: '넘기기'
    })
    .setDescription('Skips the currently playing music.')
    .setDescriptionLocalizations({
      ko: '재생중인 음악을 넘깁니다.'
    })
    .addIntegerOption(option => option
      .setName('skipto')
      .setNameLocalizations({
        ko: '순서'
      })
      .setDescription('Skip to the specified track.')
      .setDescriptionLocalizations({
        ko: '지정한 곡으로 넘깁니다.'
      })
    ),

  async execute (interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.players.get(interaction.guildId)
    if (player == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(await interaction.client.locale(interaction, 'command.skip.title'))
      .setDescription(`${player.queue.current?.info.title}`)
    await interaction.followUp({ embeds: [embed] })

    if (player.queue.tracks.length === 0) {
      return await player.stopPlaying()
    } else {
      await player.skip((interaction.options).getInteger('skipto') ?? 0)
    }
  }
}
