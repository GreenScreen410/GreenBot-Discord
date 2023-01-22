import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { QueueRepeatMode } from "discord-player";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("자동재생")
    .setDescription("재생되고 있는 노래와 관련된 노래를 그린Bot이 직접 찾고, 재생합니다.")
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setDescription(`${queue.current.title}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    if (queue.repeatMode == QueueRepeatMode.AUTOPLAY) {
      queue.setRepeatMode(QueueRepeatMode.OFF);
      embed.setTitle("🔍 대기열대로 노래를 재생합니다.")
      return interaction.followUp({ embeds: [embed] });
    }

    if (queue.repeatMode == QueueRepeatMode.OFF) {
      queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
      embed.setTitle("🔍 관련된 노래를 자동재생합니다.")
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
