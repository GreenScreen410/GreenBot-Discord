import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('마크')
    .setDescription('마인크래프트 서버 정보를 확인합니다.')
    .addStringOption((option) => option
      .setName('주소')
      .setDescription('서버 주소를 입력해 주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const server = interaction.options.getString('주소', true)
    const response = await axios.get(`https://api.mcsrvstat.us/3/${encodeURIComponent(server)}`)

    if (response.data.ip === '127.0.0.1') {
      await interaction.client.error.INVALID_ARGUMENT(interaction, server)
      return
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setThumbnail(`https://api.mcsrvstat.us/icon/${encodeURIComponent(server)}`)
      .setTitle(`${response.data.motd.clean.join('\n')}`)
      .setDescription(`${response.data.ip}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` })

    if (response.data.online === true) {
      embed.addFields(
        { name: '🛜 서버 상태', value: '✅', inline: true },
        { name: '👥 플레이어', value: `${response.data.players.online}/${response.data.players.max}`, inline: true },
        { name: '🔗 버전', value: `${response.data.version}`, inline: true }
      )
    } else {
      embed.addFields(
        { name: '🛜 서버 상태', value: '❌' }
      )
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
