import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import type { RepeatMode } from 'lavalink-client';
import { isInSameVoiceChannel } from '@/utils/voice.js';

export default {
  data: new SlashCommandBuilder()
    .setName('loop')
    .setNameLocalizations({
      ko: '반복'
    })
    .setDescription('Loop the current track or the whole queue.')
    .setDescriptionLocalizations({
      ko: '재생중인 음악을 반복합니다.'
    })
    .addStringOption((option) =>
      option
        .setName('type')
        .setNameLocalizations({
          ko: '유형'
        })
        .setDescription('Specify the target to repeat.')
        .setDescriptionLocalizations({
          ko: '반복할 대상을 지정해 주세요.'
        })
        .addChoices(
          {
            name: 'Off',
            name_localizations: {
              ko: '끄기'
            },
            value: 'off'
          },
          {
            name: 'Track',
            name_localizations: {
              ko: '트랙'
            },
            value: 'track'
          },
          {
            name: 'Queue',
            name_localizations: {
              ko: '재생목록'
            },
            value: 'queue'
          }
        )
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    const currentTrack = player?.queue.current;
    if (!currentTrack) return interaction.error.musicQueueIsEmpty();
    if (!isInSameVoiceChannel(interaction)) return interaction.error.pleaseJoinSameVoiceChannel();

    const option = interaction.options.getString('type', true) as RepeatMode;
    await player.setRepeatMode(option);

    const { info } = currentTrack;
    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(interaction.i18n(`command.loop.${option}`))
      .setDescription(info.title)
      .setURL(info.uri);
    if (info.artworkUrl) embed.setThumbnail(info.artworkUrl);

    await interaction.reply({ embeds: [embed] });
  }
};
