import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('학교정보')
    .setDescription('학교의 기본 정보를 알려줍니다.')
    .addStringOption((option) => option
      .setName('학교명')
      .setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const school = interaction.options.getString('학교명', true)
    const response = await axios.get(`https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(school)}&key=${process.env.NEIS_OPENINFO_KEY}`)
    if (response.data.RESULT !== undefined) {
      return interaction.client.error.INVALID_ARGUMENT(interaction, school)
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${response.data.schoolInfo[1].row[0].SCHUL_NM}`)
      .setDescription(`${response.data.schoolInfo[1].row[0].HMPG_ADRES}`)
      .addFields(
        { name: '🎂 개교일', value: `${response.data.schoolInfo[1].row[0].FOND_YMD}` },
        { name: '🌐 영문', value: `${response.data.schoolInfo[1].row[0].ENG_SCHUL_NM}` },
        { name: '🏫 종류', value: `${response.data.schoolInfo[1].row[0].HS_GNRL_BUSNS_SC_NM}` },
        { name: '🏠 주소', value: `${response.data.schoolInfo[1].row[0].ORG_RDNMA}` },
        { name: '📞 전화번호', value: `${response.data.schoolInfo[1].row[0].ORG_TELNO}` },
        { name: '🔢 학교코드', value: `${response.data.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE + response.data.schoolInfo[1].row[0].SD_SCHUL_CODE}` },
        { name: '📅 데이터 수정일자', value: `${response.data.schoolInfo[1].row[0].LOAD_DTM}` }
      )
    await interaction.followUp({ embeds: [embed] })
  }
}
