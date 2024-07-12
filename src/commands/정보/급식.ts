import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('급식')
    .setDescription('학교의 시간표를 알려줍니다. 현재는 고등학교만 지원합니다.')
    .addStringOption((option) => option
      .setName('학교')
      .setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const school = interaction.options.getString('학교', true)
    const schoolResponse = (await axios.get(`https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(school)}&key=${process.env.NEIS_OPENINFO_KEY}`)).data
    if (schoolResponse.RESULT !== undefined) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, school)
    }

    const date = new Date()
    const today = String(date.getFullYear()) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2)
    const educationCode = schoolResponse.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE
    const schoolCode = schoolResponse.schoolInfo[1].row[0].SD_SCHUL_CODE
    const response = (await axios.get(`https://open.neis.go.kr/hub/mealServiceDietInfo?Type=json&pIndex=&pSize=&ATPT_OFCDC_SC_CODE=${educationCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${today}&key=${process.env.NEIS_OPENINFO_KEY}`)).data

    // 예외 처리 개선 필요
    try {
      // 아무 의미 없는 코드, 오류 발생용
      console.log(response.mealServiceDietInfo[0].head[1].RESULT.CODE === 'INFO-000')
    } catch (error) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, '학년, 반 정보가 잘못되었습니다.')
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${response.mealServiceDietInfo[1].row[0].SCHUL_NM} 급식`)
      .setDescription(`${(response.mealServiceDietInfo[1].row[0].DDISH_NM).replace(/<br\/>/g, '\n')}`)
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    await interaction.followUp({ embeds: [embed] })
  }
}
