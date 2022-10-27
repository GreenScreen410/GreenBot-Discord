import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import MusicPlaylistButton from "../../buttons/음악/재생목록.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("섞기")
    .setDescription("노래 재생목록을 랜덤하게 섞습니다.")
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

    queue.shuffle();

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🔀 셔플 완료!")
      .setDescription("재생목록이 랜덤하게 섞였습니다. 한번 확인해 보세요!")
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(MusicPlaylistButton.data)

    interaction.followUp({ embeds: [embed], components: [button] });
  },
};
