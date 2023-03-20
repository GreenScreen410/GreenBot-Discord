import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import MusicQueueButton from "../../buttons/음악/재생목록.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("제거")
    .setDescription("노래를 재생목록에서 제거합니다.")
    .addNumberOption((option) => option
      .setName("노래")
      .setDescription("재생목록 번호를 입력해 주세요.")
      .setRequired(true))
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const trackIndex = interaction.options.getNumber("노래", true) - 1;
    const queue = player.getQueue(interaction.guildId);
    if (!queue || !queue.playing) {
      return ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }
    if (!queue.tracks[trackIndex]) {
      return ERROR.CAN_NOT_FIND_MUSIC(interaction);
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(queue.tracks[trackIndex].thumbnail)
      .setTitle("🗑️ 재생목록에서 제거되었습니다.")
      .setDescription(`${queue.tracks[trackIndex].title}`)
      .setURL(`${queue.tracks[trackIndex].url}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(MusicQueueButton.data)
    interaction.followUp({ embeds: [embed], components: [button] });

    queue.remove(trackIndex);
  },
};
