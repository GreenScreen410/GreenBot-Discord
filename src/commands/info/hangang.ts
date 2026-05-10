import dayjs from 'dayjs';
import { type ChatInputCommandInteraction, ContainerBuilder, MessageFlags, SeparatorSpacingSize, SlashCommandBuilder, TimestampStyles, time } from 'discord.js';

interface StationData {
  TEMP: number;
  PH: number;
  LAST_UPDATE: string;
}

interface HangangResponse {
  STATUS: string;
  MSG: string;
  DATAs: {
    CACHE_META: {
      CREATED_AT: number;
      UPDATED_AT: number;
      DATA_KEY: string;
    };
    DATA: {
      HANGANG: Record<string, StationData>;
    };
  };
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

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const response = await fetch('https://api.hangang.life/');
    if (!response.ok) return interaction.error.unknownError();

    let data: HangangResponse;
    try {
      data = (await response.json()) as HangangResponse;
    } catch {
      return interaction.error.unknownError();
    }
    if (data.STATUS !== 'OK') return interaction.error.unknownError();

    const stations = Object.entries(data.DATAs.DATA.HANGANG).map(([location, station]) => ({ location, ...station }));
    if (stations.length === 0) return interaction.error.unknownError();

    const validStations = stations.filter((station) => station.TEMP != null && station.PH != null);
    const totalTemperature = validStations.reduce((sum, station) => sum + station.TEMP, 0);
    const averageTemperature = totalTemperature / validStations.length;
    const hottestStation = validStations.reduce((previous, current) => (current.TEMP > previous.TEMP ? current : previous));
    const coldestStation = validStations.reduce((previous, current) => (current.TEMP < previous.TEMP ? current : previous));

    const t = interaction.i18n;
    const na = t('command.hangang.notMeasurable');

    const container = new ContainerBuilder();
    container.addTextDisplayComponents(
      (text) => text.setContent(`## ${t('command.hangang.title')}`),
      (text) => text.setContent(`${t('command.hangang.lastUpdate')}: ${time(data.DATAs.CACHE_META.UPDATED_AT, TimestampStyles.LongDateShortTime)}`)
    );
    container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
    if (validStations.length > 0) {
      container.addTextDisplayComponents(
        (text) => text.setContent(`### ${t('command.hangang.overview')}`),
        (text) =>
          text.setContent(
            `- **${t('command.hangang.avgTemp')}:** ${averageTemperature.toFixed(1)}°C\n` +
              `- **${t('command.hangang.hottest')}:** ${hottestStation.location} (${hottestStation.TEMP.toFixed(1)}°C)\n` +
              `- **${t('command.hangang.coldest')}:** ${coldestStation.location} (${coldestStation.TEMP.toFixed(1)}°C)\n` +
              `- **${t('command.hangang.stations')}:** ${t('command.hangang.stationsCount', { count: stations.length })}`
          )
      );
    }
    container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
    stations.forEach((station, index) => {
      container.addTextDisplayComponents((text) =>
        text.setContent(
          `### ${station.location}\n` +
            `🌡️ **${t('command.hangang.temperature')}:** ${station.TEMP != null ? `${station.TEMP.toFixed(1)}°C` : na}\n` +
            `🧪 **${t('command.hangang.ph')}:** ${station.PH != null ? station.PH.toFixed(1) : na}\n` +
            `🕒 **${t('command.hangang.timestamp')}:** ${time(dayjs(station.LAST_UPDATE).unix(), TimestampStyles.LongDateShortTime)}`
        )
      );
      if (index < stations.length - 1) {
        container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
      }
    });

    await interaction.editReply({ components: [container], flags: MessageFlags.IsComponentsV2 });
  }
};
