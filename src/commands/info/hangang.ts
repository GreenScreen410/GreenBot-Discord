import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, time } from 'discord.js'
import axios from 'axios'
import dayjs from 'dayjs'

interface HangangResponse {
  DATAs: {
    CACHE_META: {
      CREATED_AT: number
      UPDATED_AT: number
      DATA_KEY: string
    }
    DATA: {
      HANGANG: Record<string, {
        TEMP: number
        LAST_UPDATE: string
        PH: number
      }>
    }
  }
}

export default {
  data: new SlashCommandBuilder()
    .setName('hangang')
    .setNameLocalizations({
      ko: '한강'
    })
    .setDescription('Check the temperature of the Han River.')
    .setDescriptionLocalizations({
      ko: '한강의 수온을 확인합니다.'
    }),

  async execute (interaction: ChatInputCommandInteraction) {
    const { data: response } = await axios.get<HangangResponse>('https://api.hangang.life/')

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle('🌡️ 한강 수온')
      .setDescription(`최근 업데이트: ${time(response.DATAs.CACHE_META.UPDATED_AT)}`)

    for (const [location, { TEMP, PH, LAST_UPDATE }] of Object.entries(response.DATAs.DATA.HANGANG)) {
      embed.addFields({ name: location, value: `수온: ${TEMP}°C\nPH: ${PH}\n${time(dayjs(LAST_UPDATE).unix())} 기준` })
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
