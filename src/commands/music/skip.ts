import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

export default {
  data: new SlashCommandBuilder()
    .setName('skip')
    .setNameLocalizations({
      ko: '넘기기'
    })
    .setDescription('Skips the currently playing music.')
    .setDescriptionLocalizations({
      ko: '재생중인 음악을 넘깁니다.'
    })
    .addIntegerOption((option) =>
      option
        .setName('skipto')
        .setNameLocalizations({
          ko: '순서'
        })
        .setDescription('Skip to the specified track.')
        .setDescriptionLocalizations({
          ko: '지정한 곡으로 넘깁니다.'
        })
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    const currentTrack = player?.queue.current;
    if (!currentTrack) return interaction.error.musicQueueIsEmpty();
    if (!isInSameVoiceChannel(interaction)) return interaction.error.pleaseJoinSameVoiceChannel();

    const skipto = interaction.options.getInteger('skipto') ?? 0;
    if (skipto < 0 || (skipto > 0 && skipto >= player.queue.tracks.length)) {
      return interaction.error.invalidArgument();
    }

    const embed = new EmbedBuilder().setColor('Random').setTitle(interaction.i18n('command.skip.title')).setDescription(currentTrack.info.title);
    await interaction.reply({ embeds: [embed] });

    if (player.queue.tracks.length === 0) await player.stopPlaying();
    else await player.skip(skipto);
  }
};
