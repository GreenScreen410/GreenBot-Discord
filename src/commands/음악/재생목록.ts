import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("재생목록")
    .setDescription("노래 재생목록을 확인합니다.")
    .addStringOption(option => option
      .setName("옵션")
      .setDescription("옵션을 지정해 주세요.")
      .addChoices({ name: "초기화", value: "clear" })
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

    try {
      if (interaction.options.getString("옵션") == "clear") {
        queue.clear();

        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("💥 펑!")
          .setDescription("재생목록이 초기화되었습니다!")
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        return interaction.followUp({ embeds: [embed] });

      } else {
        const currentTrack = queue.current;
        const tracks = queue.tracks.slice(0, 10).map((m, i) => {
          return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`;
        });

        if (queue.tracks.length == 0) {
          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("📄 노래 재생목록")
            .addFields({
              name: "재생중인 노래",
              value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
            })
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
          return interaction.followUp({ embeds: [embed] });

        } else {
          const embed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("📄 노래 재생목록")
            .setDescription(`${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}` : ""}`)
            .addFields({
              name: "재생중인 노래",
              value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
            })
            .setTimestamp()
            .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

          return interaction.followUp({ embeds: [embed] });
        }
      }
    } catch {
      const currentTrack = queue.current;
      const tracks = queue.tracks.slice(0, 10).map((m, i) => {
        return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`;
      });

      if (queue.tracks.length == 0) {
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("📄 노래 재생목록")
          .addFields({
            name: "재생중인 노래",
            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
          })
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
        return interaction.followUp({ embeds: [embed] });

      } else {
        const embed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("📄 노래 재생목록")
          .setDescription(`${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}` : ""}`)
          .addFields({
            name: "재생중인 노래",
            value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
          })
          .setTimestamp()
          .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

        return interaction.followUp({ embeds: [embed] });
      }
    }
  },
};
