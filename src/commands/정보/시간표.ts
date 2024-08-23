import { type ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from 'discord.js'
import axios from 'axios'

export default {
  data: new SlashCommandBuilder()
    .setName('시간표')
    .setDescription('학교의 시간표를 알려줍니다. 현재는 고등학교만 지원합니다.')
    .addStringOption((option) => option
      .setName('학교')
      .setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('학년')
      .setDescription('학년을 적어주세요.')
      .setRequired(true))
    .addStringOption((option) => option
      .setName('반')
      .setDescription('반을 적어주세요.')
      .setRequired(true)),

  async execute (interaction: ChatInputCommandInteraction) {
    const school = interaction.options.getString('학교', true)
    const grade = interaction.options.getString('학년', true)
    const classNumber = interaction.options.getString('반', true)

    const schoolResponse = (await axios.get(`https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(school)}&key=${process.env.NEIS_OPENINFO_KEY}`)).data
    if (schoolResponse.RESULT !== undefined) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, school)
    }

    const date = new Date()
    const today = String(date.getFullYear()) + ('0' + (date.getMonth() + 1)).slice(-2) + ('0' + date.getDate()).slice(-2)
    const educationCode = schoolResponse.schoolInfo[1].row[0].ATPT_OFCDC_SC_CODE
    const schoolCode = schoolResponse.schoolInfo[1].row[0].SD_SCHUL_CODE
    const response = (await axios.get(`https://open.neis.go.kr/hub/hisTimetable?Type=json&pIndex=&pSize=&ATPT_OFCDC_SC_CODE=${educationCode}&SD_SCHUL_CODE=${schoolCode}&GRADE=${grade}&CLASS_NM=${classNumber}&ALL_TI_YMD=${today}&key=${process.env.NEIS_OPENINFO_KEY}`)).data

    // 예외 처리 개선 필요
    try {
      // 아무 의미 없는 코드, 오류 발생용
      console.log(response.hisTimetable[0].head[1].RESULT.CODE === 'INFO-000')
    } catch (error) {
      return await interaction.client.error.INVALID_ARGUMENT(interaction, '학년, 반 정보가 잘못되었습니다.\n또는 나이스 시간표 미지원 학교입니다.')
    }

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`${response.hisTimetable[1].row[0].SCHUL_NM} ${grade}학년 ${classNumber}반 시간표`)
      .setDescription(`${response.hisTimetable[1].row[0].ALL_TI_YMD}\n과목명은 NCS 기준으로 출력되며, 실제 학교 내에서 사용하는 과목 이름과 다를 수 있습니다.`)
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: interaction.user.displayAvatarURL() })

    for (let i = 0; i < response.hisTimetable[0].head[0].list_total_count; i++) {
      embed.addFields(
        { name: `${response.hisTimetable[1].row[i].PERIO}교시`, value: `${response.hisTimetable[1].row[i].ITRT_CNTNT}` }
      )
    }

    await interaction.followUp({ embeds: [embed] })
  }
}
