import dayjs from 'dayjs';
import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SeparatorSpacingSize, SlashCommandBuilder } from 'discord.js';

const NEIS_API_URL = 'https://open.neis.go.kr/hub';

interface SchoolInfoResponse {
  RESULT?: { CODE: string; MESSAGE: string };
  schoolInfo?: [{ head: unknown[] }, { row: { ATPT_OFCDC_SC_CODE: string; SD_SCHUL_CODE: string; SCHUL_NM: string }[] }];
}

interface MealRow {
  SCHUL_NM: string;
  MMEAL_SC_NM: string;
  DDISH_NM: string;
  CAL_INFO: string;
  MLSV_YMD: string;
}

interface MealServiceResponse {
  RESULT?: { CODE: string; MESSAGE: string };
  mealServiceDietInfo?: [{ head: unknown[] }, { row: MealRow[] }];
}

export default {
  data: new SlashCommandBuilder()
    .setName('급식')
    .setDescription('학교의 급식을 알려줍니다.')
    .addStringOption((option) =>
      option.setName('학교').setDescription('정식 명칭을 적어주세요. 정식 명칭이 아닐 시 결과가 나오지 않을 수 있습니다.').setRequired(true)
    )
    .addStringOption((option) => option.setName('날짜').setDescription('조회할 날짜 (YYYYMMDD). 기본값은 오늘입니다.')),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const school = interaction.options.getString('학교', true);
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

    const mealResponse = await fetch(
      `${NEIS_API_URL}/mealServiceDietInfo?Type=json&ATPT_OFCDC_SC_CODE=${educationCode}&SD_SCHUL_CODE=${schoolCode}&MLSV_YMD=${date}&key=${key}`
    );
    if (!mealResponse.ok) return interaction.error.unknownError();

    let mealData: MealServiceResponse;
    try {
      mealData = (await mealResponse.json()) as MealServiceResponse;
    } catch {
      return interaction.error.unknownError();
    }
    if (!mealData.mealServiceDietInfo) return interaction.error.invalidArgument();

    const meals = mealData.mealServiceDietInfo[1].row;
    const schoolName = meals[0].SCHUL_NM;
    const formattedDate = `${date.slice(0, 4)}.${date.slice(4, 6)}.${date.slice(6, 8)}`;

    const container = new ContainerBuilder();
    container.addTextDisplayComponents((text) => text.setContent(`## 🍽️ ${schoolName} 급식\n${formattedDate}`));

    meals.forEach((meal) => {
      const menu = meal.DDISH_NM.replace(/<br\/>/g, '\n');

      container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      container.addTextDisplayComponents((text) => text.setContent(`### ${meal.MMEAL_SC_NM}\n${menu}\n-# ${meal.CAL_INFO}`));
    });

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
