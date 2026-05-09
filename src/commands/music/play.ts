import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

function msToTime(ms: number): string {
  const hours = Math.floor(ms / 3600000);
  const minutes = Math.floor((ms % 3600000) / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

export default {
  data: new SlashCommandBuilder()
    .setName('play')
    .setNameLocalizations({
      ko: '재생'
    })
    .setDescription('Play a music.')
    .setDescriptionLocalizations({
      ko: '음악을 재생합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('query')
        .setNameLocalizations({
          ko: '음악'
        })
        .setDescription('Enter the title or link.')
        .setDescriptionLocalizations({
          ko: '제목, 또는 링크를 입력해 주세요.'
        })
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const { member, guildId, channelId, client } = interaction;

    if (!member.voice.channelId) {
      return interaction.error.pleaseJoinVoiceChannel();
    }
    if (!isInSameVoiceChannel(interaction)) {
      return interaction.error.pleaseJoinSameVoiceChannel();
    }

    await interaction.deferReply();

    const query = interaction.options.getString('query', true);
    const player =
      client.lavalink.getPlayer(guildId) ??
      client.lavalink.createPlayer({
        guildId,
        voiceChannelId: member.voice.channelId,
        textChannelId: channelId,
        selfDeaf: true,
        selfMute: false,
        volume: 100,
        instaUpdateFiltersFix: true,
        applyVolumeAsFilter: false
      });

    if (!player.connected) await player.connect();

    const result = await player.search({ query }, interaction.user);
    if (result.tracks.length === 0) {
      return interaction.error.invalidArgument();
    }

    const isPlaylist = result.loadType === 'playlist' && result.playlist;
    await player.queue.add(isPlaylist ? result.tracks : result.tracks[0]);

    const embed = new EmbedBuilder().setColor('Random').setTitle(interaction.i18n('command.play.title'));

    if (isPlaylist && result.playlist) {
      const playlist = result.playlist;
      embed
        .setDescription(playlist.name)
        .addFields(
          { name: interaction.i18n('command.play.track_count'), value: `${result.tracks.length}` },
          { name: interaction.i18n('command.play.duration'), value: msToTime(playlist.duration) }
        );
      if (playlist.uri) embed.setURL(playlist.uri);
      if (playlist.thumbnail) embed.setThumbnail(playlist.thumbnail);
    } else {
      const track = result.tracks[0];
      const { info } = track;
      const duration = info.isStream ? 'Live' : info.duration ? msToTime(info.duration) : 'N/A';

      embed
        .setDescription(info.title)
        .addFields(
          { name: interaction.i18n('command.play.author'), value: info.author ?? 'N/A' },
          { name: interaction.i18n('command.play.source_name'), value: info.sourceName ?? 'N/A' },
          { name: interaction.i18n('command.play.duration'), value: duration }
        );
      if (info.uri) embed.setURL(info.uri);
      if (info.artworkUrl) embed.setThumbnail(info.artworkUrl);
    }

    await interaction.editReply({ embeds: [embed] });
    if (!player.playing) await player.play();
  }
};
