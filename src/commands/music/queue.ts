import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

export default {
  data: new SlashCommandBuilder()
    .setName('queue')
    .setNameLocalizations({
      ko: '재생목록'
    })
    .setDescription('Check the music playlist.')
    .setDescriptionLocalizations({
      ko: '음악 재생목록을 확인합니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.players.get(interaction.guildId);
    const currentTrack = player?.queue.current;
    if (!currentTrack) return interaction.error.musicQueueIsEmpty();
    if (!isInSameVoiceChannel(interaction)) return interaction.error.pleaseJoinSameVoiceChannel();

    const { tracks } = player.queue;
    const { info } = currentTrack;

    const i18n = interaction.i18n;
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(info.title)
      .setURL(info.uri)
      .addFields({ name: i18n('command.queue.author'), value: info.author, inline: true }, { name: i18n('command.queue.source'), value: info.sourceName, inline: true })
      .setTimestamp();
    if (info.artworkUrl) embed.setThumbnail(info.artworkUrl);

    if (tracks.length > 0) {
      const displayCount = Math.min(tracks.length, 10);
      let trackList = tracks
        .slice(0, displayCount)
        .map((t, i) => `\`${i + 1}.\` ${t.info.title} • ${t.info.author}`)
        .join('\n');

      if (trackList.length > 1000) {
        trackList = `${trackList.slice(0, 1000)}...`;
      }

      embed.addFields({ name: i18n('command.queue.queueTitle', { count: tracks.length }), value: trackList });
      embed.setFooter({ text: i18n('command.queue.footer', { shown: displayCount, total: tracks.length }) });
    } else {
      embed.setFooter({ text: i18n('command.queue.empty') });
    }

    await interaction.reply({ embeds: [embed] });
  }
};
