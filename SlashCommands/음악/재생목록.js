const { MessageEmbed } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "재생목록",
  description: "노래 재생목록을 확인합니다.",

  run: function (client, interaction, args) {
    const queue = player.getQueue(interaction.guildId);

    // 재생목록이 없을 때 또는(||) 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      // ERROR 파일의 MUSIC_QUEUE_IS_EMPTY 함수 실행
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // 현재 재생목록을 currentTrack이라는 변수에 저장
    const currentTrack = queue.current;
    const tracks = queue.tracks.slice(0, 10).map((m, i) => {
      return `${i + 1}. [**${m.title}**](${m.url}) - ${m.requestedBy.tag}`;
    });

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("노래 재생목록")
      .setDescription(
        `${tracks.join("\n")}${
          queue.tracks.length > tracks.length
            ? `\n...${
                queue.tracks.length - tracks.length === 1
                  ? `${queue.tracks.length - tracks.length} more track`
                  : `${queue.tracks.length - tracks.length} more tracks`
              }`
            : ""
        }`
      )
      .addFields({
        name: "재생중인 노래",
        value: `🎶 | [**${currentTrack.title}**](${currentTrack.url}) - ${currentTrack.requestedBy.tag}`,
      })
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });

    interaction.followUp({ embeds: [embed] });
  },
};
