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
    // songTitle이라는 변수에 입력한 노래 제목을 저장
    const songTitle = interaction.options.getString("노래");

    // 음성 채널에 접속해 있지 않을 때
    if (!interaction.member.voice.channel) {
      // ERROR 파일의 PLEASE_JOIN_VOICE_CHANNEL 함수 실행
      ERROR.PLEASE_JOIN_VOICE_CHANNEL(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // 같은 음성 채널에 접속하고 있지 않을 때
    if (
      interaction.guild.me.voice.channelId &&
      interaction.member.voice.channelId !==
        interaction.guild.me.voice.channelId
    ) {
      // ERROR 파일의 PLEASE_JOIN_SAME_VOICE_CHANNEL 함수 실행
      ERROR.PLEASE_JOIN_SAME_VOICE_CHANNEL(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // queue라는 이름의 재생목록 변수 생성
    const queue = await player.createQueue(interaction.guild, {
      metadata: interaction,
    });

    // 음성 채널 연결 시도
    try {
      // 음성 채널에 연결되어 있지 않는다면
      if (!queue.connection) {
        // 재생목록을 현재 위치한 음성 채널과 연결
        await queue.connect(interaction.member.voice.channel);
      }

      // 음성 채널 연결 실패 시
    } catch (error) {
      // 재생목록 삭제
      queue.destroy();

      // ERROR 파일의 CAN_NOT_JOIN_VOICE_CHANNEL 함수 실행
      ERROR.CAN_NOT_JOIN_VOICE_CHANNEL(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    const track = await player.search(songTitle, {
      requestedBy: interaction.user,
      searchEngine: QueryType.AUTO,
    });

    // 노래를 찾지 못하였을 때
    if (!track || !track.tracks.length) {

      // ERROR 파일의 CAN_NOT_FIND_MUSIC 함수 실행
      ERROR.CAN_NOT_FIND_MUSIC(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
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
