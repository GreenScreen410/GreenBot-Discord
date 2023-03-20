import { Client, ChatInputCommandInteraction, EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle } from "discord.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";
import MusicQueueButton from "./재생목록.js";

export default {
  data: new ButtonBuilder()
    .setCustomId("MusicRemoveButton")
    .setLabel("이거 아니에요!")
    .setEmoji("🗑️")
    .setStyle(ButtonStyle.Danger),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }
    if (!queue.tracks[0]) {
      return ERROR.CAN_NOT_FIND_MUSIC(interaction);
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(queue.tracks[0].thumbnail)
      .setTitle("🗑️ 재생목록에서 제거되었습니다.")
      .setDescription(`${queue.tracks[0].title}`)
      .setURL(`${queue.tracks[0].url}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    queue.remove(0);

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(MusicQueueButton.data)
    interaction.followUp({ embeds: [embed], components: [button] });
  }
};
