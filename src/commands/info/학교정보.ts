import axios from 'axios';
import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';

export default {
  data: new SlashCommandBuilder()
    .setName('학교정보')
    .setDescription('학교의 기본 정보를 알려줍니다.')
    .addStringOption((option) =>
      option.setName('학교명').setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.').setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();
    const school = interaction.options.getString('학교명', true);

    const { data } = await axios.get(
      `https://open.neis.go.kr/hub/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(school)}&key=${process.env.NEIS_OPENINFO_KEY}`
    );
    if (data.RESULT) return interaction.error.invalidArgument();

    const info = data.schoolInfo[1].row[0];
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🏫 ${info.SCHUL_NM}`)
      .setURL(info.HMPG_ADRES)
      .addFields(
        { name: '🎂 개교일', value: info.FOND_YMD },
        { name: '🌐 영문', value: info.ENG_SCHUL_NM },
        { name: '📚 종류', value: info.HS_GNRL_BUSNS_SC_NM || info.SCHUL_KND_SC_NM },
        { name: '🏠 주소', value: info.ORG_RDNMA },
        { name: '📞 전화번호', value: info.ORG_TELNO },
        { name: '🔢 학교코드', value: `${info.ATPT_OFCDC_SC_CODE}${info.SD_SCHUL_CODE}` }
      )
      .setFooter({ text: `데이터 수정일: ${info.LOAD_DTM}` });

    await interaction.editReply({ embeds: [embed] });
  }
};
