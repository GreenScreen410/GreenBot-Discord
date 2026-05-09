import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

export default {
  data: new SlashCommandBuilder()
    .setName('remove')
    .setNameLocalizations({
      ko: '제거'
    })
    .setDescription('Remove a specific music from the playlist.')
    .setDescriptionLocalizations({
      ko: '재생목록에서 특정 음악을 제거합니다.'
    })
    .addIntegerOption((option) =>
      option
        .setName('number')
        .setNameLocalizations({
          ko: '번호'
        })
        .setDescription('You can check the music number with the playlist command.')
        .setDescriptionLocalizations({
          ko: '제거할 음악 번호를 입력해주세요. 음악 번호는 재생목록 명령어에서 확인할 수 있습니다.'
        })
        .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player?.queue.current) {
      return interaction.error.musicQueueIsEmpty();
    }
    if (!isInSameVoiceChannel(interaction)) {
      return interaction.error.pleaseJoinSameVoiceChannel();
    }

    const index = interaction.options.getInteger('number', true) - 1;
    const track = player.queue.tracks[index];
    if (!track) return interaction.error.invalidArgument();

    await player.queue.remove(index);

    const embed = new EmbedBuilder().setColor('Random').setTitle(interaction.i18n('command.remove.title')).setDescription(track.info.title);
    await interaction.reply({ embeds: [embed] });
  }
};
