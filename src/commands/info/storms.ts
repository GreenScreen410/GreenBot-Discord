import dayjs from 'dayjs';
import {
  ActionRowBuilder,
  AttachmentBuilder,
  type ChatInputCommandInteraction,
  ComponentType,
  ContainerBuilder,
  type InteractionEditReplyOptions,
  MessageFlags,
  SeparatorSpacingSize,
  SlashCommandBuilder,
  StringSelectMenuBuilder,
  TimestampStyles,
  time
} from 'discord.js';
import { nearestPlace } from '@/utils/geo.js';
import { currentPoint, fetchActiveStorms, peakPoint, renderStormImage, type Storm, type StormImage } from '@/utils/storm.js';

const SELECT_ID = 'typhoon_select';
// Discord allows 25 options in a select menu.
const MAX_STORMS = 25;
const COLLECTOR_TIMEOUT = 5 * 60 * 1000;

const ACCENTS: Record<number, number> = {
  [-2]: 0x8899aa,
  [-1]: 0x4aa3df,
  0: 0x3ecf8e,
  1: 0xf5c451,
  2: 0xf0932b,
  3: 0xe66767,
  4: 0xd63031,
  5: 0xb2145a
};

const EMOJIS: Record<number, string> = {
  [-2]: '⚪',
  [-1]: '🔵',
  0: '🟢',
  1: '🟡',
  2: '🟠',
  3: '🔴',
  4: '🔴',
  5: '🟣'
};

const knotsToKmh = (knots: number) => Math.round(knots * 1.852);
const knotsToMs = (knots: number) => Math.round(knots * 0.5144);

const rankOf = (storm: Storm) => Math.min(currentPoint(storm).rank, 5);
const accentOf = (storm: Storm) => ACCENTS[rankOf(storm)] ?? ACCENTS[-2];
const emojiOf = (storm: Storm) => EMOJIS[rankOf(storm)] ?? EMOJIS[-2];

/** Turns a Zoom Earth track code (B, D, S, H1..H5, X) into a localised label. */
function label(interaction: ChatInputCommandInteraction, code: string) {
  const category = code.match(/^H([1-5])$/);
  if (category) return interaction.i18n('command.typhoon.code.H', { category: category[1] });
  return interaction.i18n(`command.typhoon.code.${code}`, { defaultValue: code });
}

function coordinates(interaction: ChatInputCommandInteraction, [longitude, latitude]: [number, number]) {
  const ns = interaction.i18n(`command.typhoon.${latitude >= 0 ? 'north' : 'south'}`);
  const ew = interaction.i18n(`command.typhoon.${longitude >= 0 ? 'east' : 'west'}`);
  return `${Math.abs(latitude).toFixed(1)}°${ns} ${Math.abs(longitude).toFixed(1)}°${ew}`;
}

/** "일본 나하 남남동쪽 약 320km" — cyclones are usually far out at sea, so name the closest known place. */
function location(interaction: ChatInputCommandInteraction, [longitude, latitude]: [number, number]) {
  const near = nearestPlace(longitude, latitude);
  if (!near) return coordinates(interaction, [longitude, latitude]);

  const region = new Intl.DisplayNames([interaction.userLocale.replace('_', '-')], { type: 'region' });
  return interaction.i18n('command.typhoon.near', {
    country: region.of(near.country) ?? near.country,
    city: (interaction.userLocale === 'ko' ? near.koreanName : null) ?? near.name,
    direction: interaction.i18n(`command.typhoon.direction.${near.direction}`),
    distance: Math.max(10, Math.round(near.distance / 10) * 10).toLocaleString()
  });
}

function describe(interaction: ChatInputCommandInteraction, storm: Storm, image: StormImage | null) {
  const t = interaction.i18n;
  const point = currentPoint(storm);
  const peak = peakPoint(storm, storm.forecast);
  const lines: string[] = [];

  if (point.wind > 0) lines.push(`- **${t('command.typhoon.wind')}:** ${knotsToMs(point.wind)}m/s (${knotsToKmh(point.wind)}km/h · ${point.wind}kt)`);
  if (point.pressure != null) lines.push(`- **${t('command.typhoon.pressure')}:** ${point.pressure}hPa`);
  lines.push(`- **${t('command.typhoon.position')}:** ${location(interaction, point.coordinates)}`);
  lines.push(`-# ${coordinates(interaction, point.coordinates)}`);
  if (storm.chance7day != null) lines.push(`- **${t('command.typhoon.chance')}:** ${storm.chance7day}%`);
  if (peak.forecast && peak.wind > point.wind) {
    lines.push(
      `- **${t('command.typhoon.peak')}:** ${label(interaction, peak.code)} · ${knotsToMs(peak.wind)}m/s (${time(dayjs(peak.date).unix(), TimestampStyles.ShortDate)})`
    );
  }
  lines.push(`- **${t('command.typhoon.observed')}:** ${time(dayjs(point.date).unix(), TimestampStyles.RelativeTime)}`);
  lines.push(
    `-# ${storm.agencies} · ${image ? `${image.satellite} · ${time(dayjs(image.date).unix(), TimestampStyles.ShortTime)}` : t('command.typhoon.noImage')}`
  );

  return lines.join('\n');
}

function buildSelect(interaction: ChatInputCommandInteraction, storms: Storm[], selected: Storm, disabled: boolean) {
  const menu = new StringSelectMenuBuilder()
    .setCustomId(SELECT_ID)
    .setPlaceholder(interaction.i18n('command.typhoon.select', { count: storms.length }))
    .setDisabled(disabled)
    .addOptions(
      storms.map((storm) => {
        const point = currentPoint(storm);
        const detail = point.wind > 0 ? `${knotsToMs(point.wind)}m/s` : `${storm.chance7day ?? 0}%`;
        return {
          label: `${label(interaction, point.code)} ${storm.name}`.slice(0, 100),
          description: `${detail} · ${location(interaction, point.coordinates)}`.slice(0, 100),
          value: storm.id,
          emoji: emojiOf(storm),
          default: storm.id === selected.id
        };
      })
    );
  return new ActionRowBuilder<StringSelectMenuBuilder>().addComponents(menu);
}

/** One storm at a time: a large satellite image, its details, and a picker for the others. */
async function buildView(interaction: ChatInputCommandInteraction, storms: Storm[], selected: Storm, disabled = false): Promise<InteractionEditReplyOptions> {
  const image = await renderStormImage(selected).catch(() => null);
  const t = interaction.i18n;
  const name = `${selected.id}.jpg`;

  const container = new ContainerBuilder().setAccentColor(accentOf(selected));
  container.addTextDisplayComponents((text) => text.setContent(`## ${emojiOf(selected)} ${label(interaction, currentPoint(selected).code)} ${selected.name}`));

  if (image) {
    container.addMediaGalleryComponents((gallery) =>
      gallery.addItems((item) => item.setURL(`attachment://${name}`).setDescription(t('command.typhoon.alt', { name: selected.name })))
    );
  }

  container.addSeparatorComponents((separator) => separator.setSpacing(SeparatorSpacingSize.Small).setDivider(true));
  container.addTextDisplayComponents((text) => text.setContent(describe(interaction, selected, image)));

  return {
    components: [container, buildSelect(interaction, storms, selected, disabled)],
    files: image ? [new AttachmentBuilder(image.buffer, { name })] : [],
    flags: MessageFlags.IsComponentsV2
  };
}

export default {
  data: new SlashCommandBuilder()
    .setName('typhoon')
    .setNameLocalizations({
      ko: '태풍'
    })
    .setDescription('Shows satellite imagery of active tropical cyclones worldwide.')
    .setDescriptionLocalizations({
      ko: '전 세계에서 활동 중인 열대저기압의 위성사진을 보여줍니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction) {
    await interaction.deferReply();

    const storms = (await fetchActiveStorms()).slice(0, MAX_STORMS);

    if (storms.length === 0) {
      const empty = new ContainerBuilder()
        .setAccentColor(ACCENTS[-2])
        .addTextDisplayComponents((text) => text.setContent(`## ${interaction.i18n('command.typhoon.title')}\n${interaction.i18n('command.typhoon.empty')}`));
      return interaction.editReply({ components: [empty], flags: MessageFlags.IsComponentsV2 });
    }

    let selected = storms[0];
    const reply = await interaction.editReply(await buildView(interaction, storms, selected));

    const collector = reply.createMessageComponentCollector<ComponentType.StringSelect>({
      componentType: ComponentType.StringSelect,
      time: COLLECTOR_TIMEOUT
    });

    collector.on('collect', async (selectInteraction) => {
      if (selectInteraction.customId !== SELECT_ID) return;
      await selectInteraction.deferUpdate();
      selected = storms.find((storm) => storm.id === selectInteraction.values[0]) ?? selected;
      await interaction.editReply(await buildView(interaction, storms, selected));
    });

    collector.on('end', async () => {
      await interaction.editReply(await buildView(interaction, storms, selected, true)).catch(() => null);
    });
  }
};
