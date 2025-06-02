import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

interface MCSrvStatResponse {
  ip: string
  motd: {
    clean: string[]
  }
  players: {
    online: number
    max: number
  }
  version: string
  online: boolean
}

export default {
  data: new SlashCommandBuilder()
    .setName('mc')
    .setNameLocalizations({
      ko: '마크'
    })
    .setDescription('Check the Minecraft server information.')
    .setDescriptionLocalizations({
      ko: '마인크래프트 서버 정보를 확인합니다.'
    })
    .addStringOption((option) => option
      .setName('address')
      .setNameLocalizations({
        ko: '주소'
      })
      .setDescription('Please enter the server address.')
      .setDescriptionLocalizations({
        ko: '서버 주소를 입력해 주세요.'
      })
      .setRequired(true)
    ),

  async execute (interaction: ChatInputCommandInteraction) {
    const server = interaction.options.getString('address', true)
    const response = await axios.get<MCSrvStatResponse>(`https://api.mcsrvstat.us/3/${encodeURIComponent(server)}`)
    if (response.data.ip === '127.0.0.1') {
      return interaction.client.error.INVALID_ARGUMENT(interaction, server)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(response.data.ip)

    if (response.data.online) {
      embed.setThumbnail(`https://api.mcsrvstat.us/icon/${encodeURIComponent(server)}`)
      embed.setDescription(response.data.motd.clean.join('\n'))
      embed.addFields(
        { name: '🛜 서버 상태', value: '✅', inline: true },
        { name: '👥 플레이어', value: `${response.data.players.online}/${response.data.players.max}`, inline: true },
        { name: '🔗 버전', value: response.data.version, inline: true }
      )
    } else {
      embed.setDescription('서버가 오프라인 상태입니다.')
      embed.addFields(
        { name: '🛜 서버 상태', value: '❌' }
      )
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
