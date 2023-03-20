import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { QueueRepeatMode } from "discord-player";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("반복")
    .setDescription("재생중인 노래를 반복합니다.")
    .addStringOption(option => option
      .setName("옵션")
      .setDescription("옵션을 지정해 주세요.")
      .addChoices({ name: "노래", value: "QUEUE" })
      .addChoices({ name: "재생목록", value: "TRACK" })
      .addChoices({ name: "끄기", value: "OFF" })
      .setRequired(true)
    )
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

    if (interaction.options.getString("옵션") == "QUEUE") {
      queue.setRepeatMode(QueueRepeatMode.QUEUE);
      embed.setTitle("🔁 노래 반복 재생이 **활성화** 되었습니다.")
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("옵션") == "TRACK") {
      queue.setRepeatMode(QueueRepeatMode.TRACK);
      embed.setTitle("🔁 재생목록 반복 재생이 **활성화** 되었습니다.")
      return interaction.followUp({ embeds: [embed] });
    }

    if (interaction.options.getString("옵션") == "OFF") {
      queue.setRepeatMode(QueueRepeatMode.OFF);
      embed.setTitle("🔁 반복 재생이 **비활성화** 되었습니다.")
      return interaction.followUp({ embeds: [embed] });
    }
  },
};
