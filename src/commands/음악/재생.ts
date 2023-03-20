import { Client, ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder, ActionRowBuilder, ButtonBuilder } from "discord.js";
import { QueryType } from "discord-player";
import MusicQueueButton from "../../buttons/음악/재생목록.js";
import MusicRemove from "../../buttons/음악/제거.js";
import player from "../../events/player/player.js";
import ERROR from "../../handler/ERROR.js";

export default {
  data: new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) => option
      .setName("노래")
      .setDescription("노래 제목을 입력해 주세요.")
      .setRequired(true))
    .setDMPermission(false),

  run: async (client: Client, interaction: ChatInputCommandInteraction) => {
    if (!interaction.inCachedGuild()) return;

    const songTitle = interaction.options.getString("노래", true);
    if (!interaction.member.voice.channel) {
      return ERROR.PLEASE_JOIN_VOICE_CHANNEL(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const queue = player.createQueue(interaction.guild, {
      metadata: interaction.channel,
    });

    try {
      if (!queue.connection) await queue.connect(interaction.member.voice.channel);
    } catch (error) {
      queue.destroy();
      return ERROR.CAN_NOT_JOIN_VOICE_CHANNEL(interaction);
    }

    const track: any = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });
    if (!track || !track.tracks.length) {
      return ERROR.CAN_NOT_FIND_MUSIC(interaction);
    }
    if (track.tracks[0].durationMS >= 10800000) {
      return ERROR.MUSIC_IS_TOO_LONG(interaction);
    }

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setThumbnail(track.tracks[0].thumbnail)
      .setTitle(`🎵 ${track.playlist ? "playlist" : "재생목록에 추가되었습니다."}`)
      .setDescription(`${track.tracks[0].title}`)
      .setURL(`${track.tracks[0].url}`)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });

    const button = new ActionRowBuilder<ButtonBuilder>().addComponents(MusicQueueButton.data, MusicRemove.data)

    if (!queue.playing) {
      track.playlist ? queue.addTracks(track.playlist) : queue.play(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed], components: [button] });
    } else if (queue.playing) {
      track.playlist ? queue.addTracks(track.playlist) : queue.addTrack(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed], components: [button] });
    }
  },
};