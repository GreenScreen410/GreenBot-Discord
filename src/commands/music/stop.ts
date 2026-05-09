import { type ChatInputCommandInteraction, EmbedBuilder, SlashCommandBuilder } from 'discord.js';
import { isInSameVoiceChannel } from '@/utils/voice.js';

export default {
  data: new SlashCommandBuilder()
    .setName('stop')
    .setNameLocalizations({
      ko: '정지'
    })
    .setDescription('Stop all music queue and exit.')
    .setDescriptionLocalizations({
      ko: '모든 음악 대기열을 초기화하고, 종료합니다.'
    }),

  async execute(interaction: ChatInputCommandInteraction<'cached'>) {
    const player = interaction.client.lavalink.getPlayer(interaction.guildId);
    if (!player) return interaction.error.musicQueueIsEmpty();
    if (!isInSameVoiceChannel(interaction)) return interaction.error.pleaseJoinSameVoiceChannel();

    await player.destroy();

    const embed = new EmbedBuilder()
      .setColor('Random')
      .setTitle(`🚫 ${interaction.i18n('command.stop.title')}`)
      .setDescription(interaction.i18n('command.stop.description'));
    await interaction.reply({ embeds: [embed] });
  }
};
