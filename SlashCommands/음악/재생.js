const { MessageEmbed } = require("discord.js");
const { QueryType } = require("discord-player");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "재생",
  description: "노래를 재생합니다.",
  options: [
    {
      name: "노래",
      description: "노래 제목을 입력해 주세요.",
      type: "STRING",
      required: true,
    },
  ],

  run: async (client, interaction) => {
    const songTitle = interaction.options.getString("노래");

    if (!interaction.member.voice.channel) {
      ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);
      return;
    }

    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);
      return;
    }

    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction,
    });

    try {
      if (!queue.connection) {
        await queue.connect(interaction.member.voice.channel);
      }
    } catch (error) {
      queue.destroy();
      ERROR.CAN_NOT_JOIN_VOICE_CHANNEL(client, interaction);
      return;
    }

    const track = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    if (!track || !track.tracks.length) {
      ERROR.CAN_NOT_FIND_MUSIC(client, interaction);
      return;
    }

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle(
        `🎶 ${track.playlist ? "playlist" : "재생목록에 추가되었습니다."}`
      )
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });

    if (!track.playlist) {
      const tr = track.tracks[0];
      embed.setThumbnail(tr.thumbnail);
      embed.setDescription(`${tr.title}`);
    }

    if (!queue.playing) {
      track.playlist
        ? queue.addTracks(track.playlist)
        : queue.play(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed] });
    } else if (queue.playing) {
      track.playlist
        ? queue.addTracks(track.playlist)
        : queue.addTrack(track.tracks[0]);
      return await interaction.followUp({ embeds: [embed] });
    }
  },
};
