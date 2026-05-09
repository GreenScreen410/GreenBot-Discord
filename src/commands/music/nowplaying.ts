import dayjs from 'dayjs';
import duration from 'dayjs/plugin/duration.js';
import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

dayjs.extend(duration);

function progressBar(current: number, total: number, size = 14): string {
  const position = Math.round((size * Math.min(current, total)) / total);
  const bar = `${'▬'.repeat(position)}🔘${'▬'.repeat(size - position)}`;

  const formatTime = (ms: number) => {
    const formatted = dayjs.duration(ms).format('HH:mm:ss');
    return formatted.startsWith('00:') ? formatted.substring(3) : formatted;
  };

  return `${formatTime(current)} ┃ ${bar} ┃ ${formatTime(total)}`;
}

export default {
  data: new SlashCommandBuilder()
    .setName('nowplaying')
    .setNameLocalizations({
      ko: '재생중'
    })
    .setDescription('Shows the currently playing music information.')
    .setDescriptionLocalizations({
      ko: '현재 재생중인 음악 정보를 알려줍니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    const currentTrack = player?.queue.current;
    if (!currentTrack) return interaction.error.musicQueueIsEmpty();
    if (!isInSameVoiceChannel(interaction)) return interaction.error.pleaseJoinSameVoiceChannel();

    const { info } = currentTrack;
    const bar = progressBar(player.position, info.duration);
    const percent = Math.round((player.position / info.duration) * 100);

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(interaction.i18n('command.nowplaying.title'))
      .setDescription(info.title)
      .setURL(info.uri)
      .addFields(
        { name: interaction.i18n('command.nowplaying.author'), value: info.author, inline: true },
        { name: interaction.i18n('command.nowplaying.source'), value: info.sourceName, inline: true },
        { name: interaction.i18n('command.nowplaying.progress', { percent }), value: bar }
      );
    if (info.artworkUrl) embed.setThumbnail(info.artworkUrl);

    await interaction.reply({ embeds: [embed] });
  }
};
