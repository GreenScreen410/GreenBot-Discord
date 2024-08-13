import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import { useQueue } from 'discord-player'

export default {
  data: new SlashCommandBuilder()
    .setName('필터')
    .setDescription('노래 필터를 추가합니다.')
    .addStringOption(option => option
      .setName('필터')
      .setDescription('필터를 지정해 주세요.')
      .addChoices({ name: '기본', value: 'normal' })
      .addChoices({ name: '8D', value: '8D' })
      .addChoices({ name: '베이스부스트 (소리 주의)', value: 'bassboost' })
      .addChoices({ name: '베이스부스트 - 고음 (소리 주의)', value: 'bassboost_high' })
      .addChoices({ name: '베이스부스트 - 저음 (소리 주의)', value: 'bassboost_low' })
      .addChoices({ name: '코러스', value: 'chorus' })
      .addChoices({ name: '코러스 (2D)', value: 'chorus2d' })
      .addChoices({ name: '코러스 (3D)', value: 'chorus3d' })
      .addChoices({ name: '컴프레서', value: 'compressor' })
      .addChoices({ name: '베이퍼웨이브', value: 'vaporwave' })
      .addChoices({ name: '나이트코어', value: 'nightcore' })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return

    const queue = useQueue(interaction.guildId)
    if (queue?.currentTrack == null) {
      return await interaction.client.error.MUSIC_QUEUE_IS_EMPTY(interaction)
    }
    if (interaction.guild.members.me?.voice.channelId != null && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return await interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction)
    }

    const filter = interaction.options.getString('필터', true)
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTimestamp()
      .setDescription(queue.currentTrack.title)
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    if (filter === 'normal') {
      await queue.filters.ffmpeg.setFilters([])
      embed.setTitle('✨ 필터가 **비활성화** 되었습니다.')
      return await interaction.followUp({ embeds: [embed] })
    } else {
      await queue.filters.ffmpeg.setFilters([filter])
      embed.setTitle(`✨ ${filter} 필터가 **활성화** 되었습니다.`)
      return await interaction.followUp({ embeds: [embed] })
    }
  }
}
