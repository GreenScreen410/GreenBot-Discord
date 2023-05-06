import { ChatInputCommandInteraction, SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { QueryType, useMasterPlayer } from "discord-player";

export default {
  data: new SlashCommandBuilder()
    .setName("재생")
    .setDescription("노래를 재생합니다.")
    .addStringOption((option) => option
      .setName("노래")
      .setDescription("노래 제목을 입력해 주세요.")
      .setRequired(true)
    ),

  async execute(interaction: ChatInputCommandInteraction) {
    if (!interaction.inCachedGuild()) return;

    if (!interaction.member.voice.channel) {
      return interaction.client.error.PLEASE_JOIN_VOICE_CHANNEL(interaction);
    }
    if (interaction.guild.members.me?.voice.channelId && interaction.member.voice.channelId !== interaction.guild.members.me.voice.channelId) {
      return interaction.client.error.PLEASE_JOIN_SAME_VOICE_CHANNEL(interaction);
    }

    const query = interaction.options.getString("노래", true);
    const player = useMasterPlayer()!;
    const results = await player.search(query, { searchEngine: QueryType.YOUTUBE });
    if (!results.hasTracks()) return interaction.client.error.INVALID_ARGUMENT(interaction, query);;

    const track = await player.play(interaction.member.voice.channel.id, results);
    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("🎵 재생목록에 추가되었습니다.")
      .setDescription(track.track.title)
      .setURL(track.track.url)
      .setThumbnail(track.track.thumbnail)
      .setTimestamp()
      .setFooter({ text: `Requested by ${interaction.user.tag}`, iconURL: `${interaction.user.displayAvatarURL()}` });
    await interaction.followUp({ embeds: [embed] });
  },
};
