const { MessageEmbed } = require("discord.js");
const player = require("../../events/player");
const ERROR = require("../ERROR");

module.exports = {
  name: "재생목록초기화",
  description: "노래 재생목록을 초기화합니다.",

  run: function (client, interaction) {
    const queue = player.getQueue(interaction.guildId);

    // 재생목록이 없을 때 또는(||) 재생중인 노래가 없을 때
    if (!queue || !queue.playing) {
      // ERROR 파일의 MUSIC_QUEUE_IS_EMPTY 함수 실행
      ERROR.MUSIC_QUEUE_IS_EMPTY(client, interaction);

      // 코드가 더 이상 실행되지 않도록 방지
      return;
    }

    // 재생목록 비우기
    queue.clear();

    const embed = new MessageEmbed()
      .setColor("RANDOM")
      .setTitle("💥 펑!")
      .setDescription("재생목록이 초기화되었습니다!")
      .setTimestamp()
      .setFooter({
        text: `Requested by ${interaction.user.tag}`,
        iconURL: `${interaction.user.displayAvatarURL()}`,
      });
    interaction.followUp({ embeds: [embed] });
  },
};
