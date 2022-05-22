import { Client, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import player from "../../events/player";
import ERROR from "../ERROR";

export default {
  ...new SlashCommandBuilder()
    .setName("재생목록")
    .setDescription("노래 재생목록을 확인합니다."),

  run: async (client: Client, interaction: any) => {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`;
    });

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("노래 재생목록")
      .setDescription(`${tracks.join("\n")}${queue.tracks.length > tracks.length ? `\n...${queue.tracks.length - tracks.length === 1 ? `${queue.tracks.length - tracks.length} more track` : `${queue.tracks.length - tracks.length} more tracks`}` : ""}`)
      .addFields({
        name: "재생중인 노래",
        value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
      })
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
};
