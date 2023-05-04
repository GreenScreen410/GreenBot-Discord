import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { useQueue } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("재생목록")
    .setDescription("노래 재생목록을 확인합니다."),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    const queue = useQueue(interaction.guildId);
    if (!queue || !queue.currentTrack) {
      return interaction.client.error.ERROR.MUSIC_QUEUE_IS_EMPTY(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const titleArray: any = [];
    queue.tracks.toArray().slice(0, queue.tracks.toArray().length).forEach((track) => {
      titleArray.push(track.title);
    });
    let queueEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`재생목록 - ${titleArray.length}개 (임시 출력 결과)`)
      .addFields(
        { name: "재생중", value: `${queue.currentTrack.title}` },
        { name: "진행도", value: `${queue.node.createProgressBar()}` });
    for (let i = 0; i < titleArray.length; i++) {
      queueEmbed.addFields({ name: (i + 1).toString(), value: titleArray[i] });
    }
    return interaction.followUp({ embeds: [queueEmbed] });
  },
};
