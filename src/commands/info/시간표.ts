import dayjs from 'dayjs';
import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SeparatorSpacingSize, SlashCommandBuilder } from 'discord.js';

const NEIS_API_URL = 'https://open.neis.go.kr/hub';

interface SchoolInfoResponse {
  RESULT?: { CODE: string; MESSAGE: string };
  schoolInfo?: [{ head: unknown[] }, { row: { ATPT_OFCDC_SC_CODE: string; SD_SCHUL_CODE: string; SCHUL_NM: string }[] }];
}

interface TimetableRow {
  SCHUL_NM: string;
  PERIO: string;
  ITRT_CNTNT: string;
  ALL_TI_YMD: string;
}

interface TimetableResponse {
  RESULT?: { CODE: string; MESSAGE: string };
  hisTimetable?: [{ head: unknown[] }, { row: TimetableRow[] }];
}

export default {
  data: new SlashCommandBuilder()
    .setName('시간표')
    .setDescription('학교의 시간표를 알려줍니다. 현재는 고등학교만 지원합니다.')
    .addStringOption((option) =>
      option.setName('학교').setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.').setRequired(true)
    )
    .addIntegerOption((option) => option.setName('학년').setDescription('학년을 적어주세요.').setRequired(true))
    .addIntegerOption((option) => option.setName('반').setDescription('반을 적어주세요.').setRequired(true))
    .addStringOption((option) => option.setName('날짜').setDescription('조회할 날짜 (YYYYMMDD). 기본값은 오늘입니다.')),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    await interaction.deferReply();

    const school = interaction.options.getString('학교', true);
    const grade = interaction.options.getInteger('학년', true);
    const classNumber = interaction.options.getInteger('반', true);
    const date = interaction.options.getString('날짜') ?? dayjs().format('YYYYMMDD');
    const key = process.env.NEIS_OPENINFO_KEY;

    const schoolResponse = await fetch(`${NEIS_API_URL}/schoolInfo?Type=json&SCHUL_NM=${encodeURIComponent(school)}&key=${key}`);
    if (!schoolResponse.ok) return interaction.error.unknownError();

    let schoolData: SchoolInfoResponse;
    try {
      schoolData = (await schoolResponse.json()) as SchoolInfoResponse;
    } catch {
      return interaction.error.unknownError();
    }
    if (schoolData.RESULT || !schoolData.schoolInfo) return interaction.error.invalidArgument();

    const { ATPT_OFCDC_SC_CODE: educationCode, SD_SCHUL_CODE: schoolCode } = schoolData.schoolInfo[1].row[0];

    const timetableResponse = await fetch(
      `${NEIS_API_URL}/hisTimetable?Type=json&ATPT_OFCDC_SC_CODE=${educationCode}&SD_SCHUL_CODE=${schoolCode}&GRADE=${grade}&CLASS_NM=${classNumber}&ALL_TI_YMD=${date}&key=${key}`
    );
    if (!timetableResponse.ok) return interaction.error.unknownError();

    let timetableData: TimetableResponse;
    try {
      timetableData = (await timetableResponse.json()) as TimetableResponse;
    } catch {
      return interaction.error.unknownError();
    }
    if (!timetableData.hisTimetable) return interaction.error.invalidArgument();

    const rows = timetableData.hisTimetable[1].row;
    const formattedDate = `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;
    const schedule = rows.map((row) => `**${row.PERIO}교시** ${row.ITRT_CNTNT}`).join('\n');

    const container = new ContainerBuilder();
    container.addTextDisplayComponents((text) => text.setContent(`## 📚 ${rows[0].SCHUL_NM} ${grade}학년 ${classNumber}반\n${formattedDate}`));
    container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
    container.addTextDisplayComponents((text) => text.setContent(schedule));
    container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
    container.addTextDisplayComponents((text) => text.setContent('-# 과목명은 NCS 기준으로 실제 학교 내 과목명과 다를 수 있습니다.'));

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
