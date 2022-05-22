import { Client, MessageEmbed } from "discord.js";
import { SlashCommandBuilder } from "@discordjs/builders";
import player from "../../events/player";
import ERROR from "../ERROR";

export default {
  ...new SlashCommandBuilder()
    .setName("섞기")
    .setDescription("노래 재생목록을 랜덤하게 섞습니다."),

  run: function (client: Client, interaction: any) {
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);
    }
    if (interaction.guild.me.voice.channelId && interaction.member.voice.channelId !== interaction.guild.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
    }

    queue.shuffle();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("🔀 셔플 완료!")
      .setDescription("재생목록이 랜덤하게 섞였습니다.")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    interaction.followUp({ embeds: [embed] });
  },
};
