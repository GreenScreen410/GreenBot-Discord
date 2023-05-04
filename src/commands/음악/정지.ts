import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("정지")
    .setDescription("모든 음악 대기열을 초기화하고, 종료합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.node.isPlaying()) {
      return interaction.client.error.ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    queue.delete();

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🚫 정지!")
      .setDescription("음악 재생을 정상적으로 종료하였습니다.")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    interaction.followUp({ embeds: [embed] });
  },
};
